import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Header } from "../components/Header";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMatchData } from "../store/scoreSlice";

export const PlayerSetupPage = () => {
  const navigate = useNavigate();

  const { currentMatchData } = useSelector((state) => state.score);

  const teamList = JSON.parse(localStorage.getItem("localTeams")) || [];
  // console.log("team list", teamList);
  console.log("current match data", currentMatchData);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });

  const [errorData, setErrorData] = useState({});

  // DETERMINE BATTING & BOWLING TEAM

  const tossWinnerId = currentMatchData?.toss?.winner?.teamId;
  const tossDecision = currentMatchData?.toss?.decision;
  console.log("toss winner", tossWinnerId, "toss decision", tossDecision);
  const firstTeam = currentMatchData?.firstTeam;
  const secondTeam = currentMatchData?.secondTeam;

  let battingTeam;
  let bowlingTeam;

  if (tossWinnerId === firstTeam?.teamId) {
    if (tossDecision === "bat") {
      battingTeam = firstTeam;
      bowlingTeam = secondTeam;
    } else {
      battingTeam = secondTeam;
      bowlingTeam = firstTeam;
    }
  } else {
    if (tossDecision === "bat") {
      battingTeam = secondTeam;
      bowlingTeam = firstTeam;
    } else {
      battingTeam = firstTeam;
      bowlingTeam = secondTeam;
    }
  }

  // PLAYER SUGGESTIONS

  const battingTeamPlayers = battingTeam?.players || [];
  const bowlingTeamPlayers = bowlingTeam?.players || [];

  const battingTeamList = battingTeamPlayers.filter((player) =>
    player.name.toLowerCase().includes(formData.striker.toLowerCase()),
  );

  const nonStrikerList = battingTeamPlayers.filter((player) =>
    player.name.toLowerCase().includes(formData.nonStriker.toLowerCase()),
  );

  const bowlingTeamList = bowlingTeamPlayers.filter((player) =>
    player.name.toLowerCase().includes(formData.bowler.toLowerCase()),
  );

  // console.log("batting team list", battingTeamList);
  // console.log("bowling team list", bowlingTeamList);

  // CHECK WHETHER PLAYER IS ALREADY SELECTED
  const isPlayerSelected = (player) => {
    const playerName = player.name.trim().toLowerCase();

    return (
      formData.striker.trim().toLowerCase() === playerName ||
      formData.nonStriker.trim().toLowerCase() === playerName ||
      formData.bowler.trim().toLowerCase() === playerName
    );
  };

  // PLAYER SCHEMA

  const playerSchema = z
    .object({
      striker: z
        .string()
        .min(3, "Striker name must be at least 3 characters")
        .max(17, "Striker name must be less than 18 characters")
        .regex(/^\S.*$/, "Name cannot start with a space")
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: "Name cannot contain only numbers",
        }),

      nonStriker: z
        .string()
        .min(3, "Non-striker name must be at least 3 characters")
        .max(17, "Non-striker name must be less than 18 characters")
        .regex(/^\S.*$/, "Name cannot start with a space")
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: "Name cannot contain only numbers",
        }),

      bowler: z
        .string()
        .min(3, "Bowler name must be at least 3 characters")
        .max(17, "Bowler name must be less than 18 characters")
        .regex(/^\S.*$/, "Name cannot start with a space")
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: "Name cannot contain only numbers",
        }),
    })
    .refine(
      (data) =>
        data.striker.trim().toLowerCase() !==
        data.nonStriker.trim().toLowerCase(),
      {
        message: "Striker and non-striker must have different names",
        path: ["nonStriker"],
      },
    );

  // HANDLE INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    // Remove current field error
    setErrorData((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Check striker and non-striker duplicate
    if (
      updatedFormData.striker.trim() &&
      updatedFormData.nonStriker.trim() &&
      updatedFormData.striker.trim().toLowerCase() ===
        updatedFormData.nonStriker.trim().toLowerCase()
    ) {
      setErrorData((prev) => ({
        ...prev,
        nonStriker: "Striker and non-striker must have different names",
      }));
    }
  };

  // SELECT PLAYER FROM SUGGESTION
  const handleSelectPlayer = (fieldName, player) => {
    // Do not allow selecting a player already used
    if (isPlayerSelected(player)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: player.name,
    }));

    setErrorData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  // CREATE NEW PLAYER OBJECT
  const createPlayer = (name) => {
    return {
      playerId: nanoid(),
      name: name.trim(),
      matches: 0,

      battingStats: {
        innings: 0,
        notOut: 0,
        runs: 0,
        balls: 0,
        bestScore: 0,
        average: 0,
        strikeRate: 0,
        thirties: 0,
        fifties: 0,
        hundreds: 0,
        ducks: 0,
        fours: 0,
        sixes: 0,
      },

      bowlingStats: {
        innings: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        bestBowling: "0/0",
        average: 0,
        economy: 0,
        strikeRate: 0,
        maidens: 0,
        threeWickets: 0,
        fiveWickets: 0,
        wides: 0,
        noBalls: 0,
        dotBalls: 0,
      },
    };
  };

  // GET EXISTING PLAYER OR CREATE NEW ONE
  const getPlayer = (name, teamPlayers) => {
    const trimmedName = name.trim().toLowerCase();

    const existingPlayer = teamPlayers.find(
      (player) => player.name.trim().toLowerCase() === trimmedName,
    );

    // Player already exists in team
    if (existingPlayer) {
      return {
        player: existingPlayer,
        isNew: false,
      };
    }

    // Player doesn't exist → create new player
    return {
      player: createPlayer(name),
      isNew: true,
    };
  };

  // START MATCH

  const handleStartMatch = (e) => {
    e.preventDefault();

    const result = playerSchema.safeParse(formData);

    const fieldError = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (!fieldError[fieldName]) {
          fieldError[fieldName] = issue.message;
        }
      });

      setErrorData(fieldError);
      return;
    }

    // EXTRA DUPLICATE CHECK

    const strikerName = formData.striker.trim().toLowerCase();
    const nonStrikerName = formData.nonStriker.trim().toLowerCase();
    const bowlerName = formData.bowler.trim().toLowerCase();

    if (strikerName === nonStrikerName) {
      setErrorData({
        nonStriker: "Striker and non-striker must have different names",
      });

      return;
    }

    // Optional safety check:
    // striker/non-striker are batting players
    // bowler belongs to bowling team
    if (strikerName === bowlerName) {
      setErrorData({
        bowler: "The same player cannot be both batsman and bowler",
      });

      return;
    }

    if (nonStrikerName === bowlerName) {
      setErrorData({
        bowler: "The same player cannot be both batsman and bowler",
      });

      return;
    }

    // GET PLAYERS

    const strikerResult = getPlayer(formData.striker, battingTeamPlayers);

    const nonStrikerResult = getPlayer(formData.nonStriker, battingTeamPlayers);

    const bowlerResult = getPlayer(formData.bowler, bowlingTeamPlayers);

    const striker = strikerResult.player;
    const nonStriker = nonStrikerResult.player;
    const bowler = bowlerResult.player;

    // CURRENT PLAYERS

    const currentPlayers = {
      striker,
      nonStriker,
      bowler,
    };

    // UPDATE FIRST TEAM
    const updatedFirstTeam = {
      ...firstTeam,

      players:
        firstTeam.teamId === battingTeam.teamId
          ? [
              ...(firstTeam.players || []),

              ...(strikerResult.isNew ? [striker] : []),

              ...(nonStrikerResult.isNew ? [nonStriker] : []),
            ]
          : [
              ...(firstTeam.players || []),

              ...(bowlerResult.isNew ? [bowler] : []),
            ],
    };

    // UPDATE SECOND TEAM
    const updatedSecondTeam = {
      ...secondTeam,

      players:
        secondTeam.teamId === battingTeam.teamId
          ? [
              ...(secondTeam.players || []),

              ...(strikerResult.isNew ? [striker] : []),

              ...(nonStrikerResult.isNew ? [nonStriker] : []),
            ]
          : [
              ...(secondTeam.players || []),

              ...(bowlerResult.isNew ? [bowler] : []),
            ],
    };

    // UPDATE LOCAL TEAMS

    const updatedLocalTeams = teamList.map((team) => {
      if (team.teamId === updatedFirstTeam.teamId) {
        return updatedFirstTeam;
      }

      if (team.teamId === updatedSecondTeam.teamId) {
        return updatedSecondTeam;
      }

      return team;
    });

    localStorage.setItem("localTeams", JSON.stringify(updatedLocalTeams));

    // CREATE UPDATED MATCH DATA

    const updatedData = {
      ...currentMatchData,

      firstTeam: updatedFirstTeam,
      secondTeam: updatedSecondTeam,

      currentPlayers,

      status: "scoring",

      innings: [
        {
          inning: 1,
          runs: 0,
          wickets: 0,
          legalBalls: 0,

          battingTeam: battingTeam.name,
          bowlingTeam: bowlingTeam.name,

          battingTeamId: battingTeam.teamId,
          bowlingTeamId: bowlingTeam.teamId,

          extras: {
            wideBallRun: 0,
            noBallRun: 0,
            byes: 0,
            legByes: 0,
            overthrow: 0,
          },
          outPlayers: [],
          perBallStat: [],
        },
      ],

      matchStatus: "ongoing",
    };

    // MATCH HISTORY

    const matchHistory = JSON.parse(
      localStorage.getItem("matchHistory") || "[]",
    );

    const updatedMatchHistory = [...matchHistory, updatedData];

    // SAVE EVERYTHING

    localStorage.setItem("currentMatch", JSON.stringify(updatedData));

    localStorage.setItem("matchHistory", JSON.stringify(updatedMatchHistory));

    dispatch(setCurrentMatchData(updatedData));

    // NAVIGATE

    navigate("/local-match/scoring");
  };

  // BUTTON VALIDATION

  const checkValidation = playerSchema.safeParse(formData);

  const isBtnDisabled = !checkValidation.success;

  // SUGGESTION ITEM COMPONENT

  const renderPlayerSuggestion = (player, fieldName) => {
    const selected = isPlayerSelected(player);

    return (
      <li
        key={player.playerId}
        onClick={() => !selected && handleSelectPlayer(fieldName, player)}
        className={`
          px-3 py-2 rounded-lg
          transition
          ${
            selected
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer hover:bg-base-200"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <span>{player.name}</span>

          {selected && <span className="text-xs opacity-60">Selected</span>}
        </div>
      </li>
    );
  };

  // UI

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <Header data="Hills Cricket Scorer" />

      <div className="mx-auto max-w-xl mt-12">
        <div className="rounded-2xl bg-base-100 p-6 shadow-lg">
          <h1 className="mb-2 text-2xl font-bold">Select Opening Players</h1>

          <p className="mb-6 text-sm opacity-70">
            Select the two opening batsmen and opening bowler.
          </p>

          <form onSubmit={handleStartMatch} className="space-y-5">
            {/* STRIKER */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Strike Batsman Name
              </label>

              <input
                type="text"
                name="striker"
                value={formData.striker}
                onChange={handleChange}
                placeholder="Enter strike batsman name"
                className="input input-bordered w-full outline-0"
                autoComplete="off"
              />

              {errorData.striker && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.striker}
                </p>
              )}

              {formData.striker && (
                <ul className="mt-1 rounded-lg border border-base-content/15 p-2 shadow-sm">
                  {battingTeamList.length > 0 ? (
                    battingTeamList.map((player) =>
                      renderPlayerSuggestion(player, "striker"),
                    )
                  ) : (
                    <li className="px-3 py-2 text-sm opacity-60">
                      No player found. This name will be added as a new player.
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* NON STRIKER */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Non-strike Batsman Name
              </label>

              <input
                type="text"
                name="nonStriker"
                value={formData.nonStriker}
                onChange={handleChange}
                placeholder="Enter non-strike batsman name"
                className="input input-bordered w-full outline-0"
                autoComplete="off"
              />

              {errorData.nonStriker && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.nonStriker}
                </p>
              )}

              {formData.nonStriker && (
                <ul className="mt-1 rounded-lg border border-base-content/15 p-2 shadow-sm">
                  {nonStrikerList.length > 0 ? (
                    nonStrikerList.map((player) =>
                      renderPlayerSuggestion(player, "nonStriker"),
                    )
                  ) : (
                    <li className="px-3 py-2 text-sm opacity-60">
                      No player found. This name will be added as a new player.
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* BOWLER */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Opening Bowler Name
              </label>

              <input
                type="text"
                name="bowler"
                value={formData.bowler}
                onChange={handleChange}
                placeholder="Enter opening bowler name"
                className="input input-bordered w-full outline-0"
                autoComplete="off"
              />

              {errorData.bowler && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.bowler}
                </p>
              )}

              {formData.bowler && (
                <ul className="mt-1 rounded-lg border border-base-content/15 p-2 shadow-sm">
                  {bowlingTeamList.length > 0 ? (
                    bowlingTeamList.map((player) =>
                      renderPlayerSuggestion(player, "bowler"),
                    )
                  ) : (
                    <li className="px-3 py-2 text-sm opacity-60">
                      No player found. This name will be added as a new player.
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* START MATCH */}

            <button
              disabled={isBtnDisabled}
              type="submit"
              className="btn btn-info w-full"
            >
              Start Match
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
