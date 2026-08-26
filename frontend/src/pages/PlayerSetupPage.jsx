import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Header } from "../components/Header";
import { nanoid } from "nanoid";
export const PlayerSetupPage = () => {
  const navigate = useNavigate();
  const matchData = JSON.parse(localStorage.getItem("currentMatch")) || {};
  const teamList = JSON.parse(localStorage.getItem("localTeams"));
  console.log(teamList);

  const [formData, setFormData] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });

  const [errorData, setErrorData] = useState({});

  //   zod player schema to handle errors
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

    // Check striker and non-striker
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

    // Create current players

    const currentPlayers = {
      striker: {
        playerId: nanoid(),
        name: formData.striker,
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
      },

      nonStriker: {
        playerId: nanoid(),
        name: formData.nonStriker,
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
      },

      bowler: {
        playerId: nanoid(),
        name: formData.bowler,
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
      },
    };

    // Determine batting & bowling team

    const tossWinnerId = matchData.toss.winner.teamId;
    const tossDecision = matchData.toss.decision;

    const firstTeam = matchData.firstTeam;
    const secondTeam = matchData.secondTeam;

    let battingTeam;
    let bowlingTeam;

    if (tossWinnerId === firstTeam.teamId) {
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

    // Update localTeams

    const updatedLocalTeams = teamList.map((team) => {
      // Batting team
      if (team.teamId === battingTeam.teamId) {
        return {
          ...team,
          players: [
            ...team.players,
            currentPlayers.striker,
            currentPlayers.nonStriker,
          ],
        };
      }

      // Bowling team
      if (team.teamId === bowlingTeam.teamId) {
        return {
          ...team,
          players: [...team.players, currentPlayers.bowler],
        };
      }

      // Other teams remain unchanged
      return team;
    });

    // Save updated local teams
    localStorage.setItem("localTeams", JSON.stringify(updatedLocalTeams));

    // Create updated match data

    const updatedData = {
      ...matchData,

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

          perBallStat: [],
        },
      ],

      matchStatus: "ongoing",
    };

    // Match history

    const matchHistory = JSON.parse(localStorage.getItem("matchHistory")) || [];

    const updatedMatchHistory = [...matchHistory, updatedData];

    // Save everything

    localStorage.setItem("currentMatch", JSON.stringify(updatedData));

    localStorage.setItem("matchHistory", JSON.stringify(updatedMatchHistory));

    // Navigate

    navigate("/local-match/scoring");
  };

  const checkValidation = playerSchema.safeParse(formData);
  const isBtnDisabled = checkValidation.success;

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
            {/* Strike Batsman */}
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
              />
              {errorData.striker && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.striker}
                </p>
              )}
            </div>

            {/* Non-strike Batsman */}
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
              />
              {errorData.nonStriker && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.nonStriker}
                </p>
              )}
            </div>

            {/* Opening Bowler */}
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
              />
              {errorData.bowler && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.bowler}
                </p>
              )}
            </div>

            {/* Start Match */}
            <button
              disabled={!isBtnDisabled}
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
