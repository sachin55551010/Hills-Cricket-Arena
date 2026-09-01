import { useMemo, useState } from "react";
import {
  ArrowLeft,
  UserRound,
  ShieldCheck,
  Trophy,
  UsersRound,
  PersonStanding,
} from "lucide-react";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { z } from "zod";

const playerNameSchema = z
  .string()
  .trim()
  .min(1, "Player name is required")
  .refine((name) => !/^\d+$/.test(name), {
    message: "Player name cannot contain only numbers",
  })
  .refine((name) => (name.match(/[A-Za-z]/g) || []).length >= 3, {
    message: "Player name must contain at least 3 letters",
  });

export const OutModal = ({ pendingData = null, onClose, onSubmit }) => {
  const { currentMatchData } = useSelector((state) => state.score);

  const [selectedWicketType, setSelectedWicketType] = useState("Bowled");

  const [playerOut, setPlayerOut] = useState(
    currentMatchData?.currentPlayers?.striker?.id || "",
  );

  const [fielder, setFielder] = useState("");
  const [completedRuns, setCompletedRuns] = useState(0);
  const [newBatsman, setNewBatsman] = useState("");
  const [newPlayerPosition, setNewPlayerPosition] = useState("striker");
  const [nameError, setNameError] = useState("");

  const currentInning =
    currentMatchData?.innings?.[currentMatchData.currentInning - 1];

  const battingTeamPlayer =
    currentInning?.battingTeamId === currentMatchData?.firstTeam?.teamId
      ? currentMatchData?.firstTeam?.players || []
      : currentMatchData?.secondTeam?.players || [];

  const bowlingTeamPlayer =
    currentInning?.bowlingTeamId === currentMatchData?.firstTeam?.teamId
      ? currentMatchData?.firstTeam?.players || []
      : currentMatchData?.secondTeam?.players || [];

  const striker = currentMatchData?.currentPlayers?.striker;
  const nonStriker = currentMatchData?.currentPlayers?.nonStriker;
  const bowler = currentMatchData?.currentPlayers?.bowler;

  const getPlayerId = (player) => player?.id ?? player?.playerId ?? "";

  const wicketTypes = [
    { type: "Bowled" },
    { type: "Caught" },
    { type: "Run Out" },
    { type: "LBW" },
    { type: "Stumped" },
    { type: "Hit Wicket" },
    { type: "Obstructing Field" },
    { type: "Hit Ball Twice" },
  ];

  /*
   * New batsman suggestions:
   * - Only batting-team players.
   * - Current striker and non-striker are disabled/excluded.
   * - If no matching player exists, the entered name can be saved as a new player.
   */
  const availableBatsmen = useMemo(() => {
    const strikerId = getPlayerId(striker);
    const nonStrikerId = getPlayerId(nonStriker);

    return battingTeamPlayer.filter((player) => {
      const id = getPlayerId(player);
      return id !== strikerId && id !== nonStrikerId;
    });
  }, [battingTeamPlayer, striker, nonStriker]);

  const filteredBatsmen = useMemo(() => {
    const search = newBatsman.trim().toLowerCase();

    if (!search) return [];

    return availableBatsmen.filter((player) =>
      player?.name?.toLowerCase().includes(search),
    );
  }, [availableBatsmen, newBatsman]);

  /*
   * Caught / Run Out:
   * Fielder must be from the bowling team.
   *
   * Stumped:
   * Fielder must be from the bowling team, except the bowler delivering
   * the current ball.
   */
  const bowlingFielders = useMemo(() => {
    const bowlerId = getPlayerId(bowler);

    return bowlingTeamPlayer.filter((player) => {
      if (selectedWicketType === "Stumped") {
        return getPlayerId(player) !== bowlerId;
      }

      return true;
    });
  }, [bowlingTeamPlayer, bowler, selectedWicketType]);

  const filteredFielders = useMemo(() => {
    const search = fielder.trim().toLowerCase();

    if (!search) return [];

    return bowlingFielders.filter((player) =>
      player?.name?.toLowerCase().includes(search),
    );
  }, [bowlingFielders, fielder]);

  /*
   * Select an existing player from a suggestion list.
   * This stores the player's actual id and name.
   */
  const selectNewBatsman = (player) => {
    setNewBatsman(player.name);
    setNameError("");
  };

  const selectFielder = (player) => {
    setFielder(player.name);
  };

  const handleWicketTypeBtn = (type) => {
    setSelectedWicketType(type);

    // Run out can dismiss either current batsman.
    // Other dismissals default to the striker.
    if (type !== "Run Out") {
      setPlayerOut(getPlayerId(striker));
    }

    if (type !== "Caught" && type !== "Run Out" && type !== "Stumped") {
      setFielder("");
    }

    setCompletedRuns(0);
    setNameError("");
  };

  const handleSubmitBtn = () => {
    const trimmedName = newBatsman.trim();

    /*
     * Validate the name only when the user is creating a new player.
     * An existing suggested player is already valid.
     */
    const existingPlayer = availableBatsmen.find(
      (player) =>
        player?.name?.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    let newPlayer;

    if (existingPlayer) {
      newPlayer = {
        playerId: getPlayerId(existingPlayer),
        name: existingPlayer.name,
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
    } else {
      const result = playerNameSchema.safeParse(trimmedName);

      if (!result.success) {
        const message =
          result.error.issues[0]?.message || "Invalid player name";
        setNameError(message);
        return;
      }

      /*
       * Do not allow a newly-created player to have the same name as ANY
       * player already in the batting team list.
       */
      const duplicateName = battingTeamPlayer.some(
        (player) =>
          player?.name?.trim().toLowerCase() === trimmedName.toLowerCase(),
      );

      if (duplicateName) {
        setNameError(
          "A player with this name already exists in the player list",
        );
        return;
      }

      newPlayer = {
        id: nanoid(),
        name: trimmedName,
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
    }

    /*
     * Validate fielder selection for dismissals that need one.
     * The fielder must come from the bowling team.
     */
    let selectedFielder = null;

    if (
      selectedWicketType === "Caught" ||
      selectedWicketType === "Run Out" ||
      selectedWicketType === "Stumped"
    ) {
      const matchingFielder = bowlingFielders.find(
        (player) =>
          player?.name?.trim().toLowerCase() === fielder.trim().toLowerCase(),
      );

      if (!matchingFielder) {
        setNameError(
          selectedWicketType === "Stumped"
            ? "Select a wicketkeeper from the bowling team (except the bowler)"
            : "Select a fielder from the bowling team",
        );
        return;
      }

      selectedFielder = {
        playerId: getPlayerId(matchingFielder),
        name: matchingFielder.name,
      };
    }

    /*
     * For run out, the user can choose which current batsman got out.
     */
    const selectedPlayerOut =
      battingTeamPlayer.find((player) => getPlayerId(player) === playerOut) ||
      (getPlayerId(striker) === playerOut ? striker : nonStriker);

    if (!selectedPlayerOut) {
      setNameError("Please select which batsman got out");
      return;
    }

    // prepare full player

    const outData = {
      wicket: true,
      wicketType: selectedWicketType,

      playerOut: {
        id: getPlayerId(selectedPlayerOut),
        name: selectedPlayerOut.name,
      },

      fielder: selectedFielder,

      completedRuns: Number(completedRuns) || 0,

      /*
       * Existing player => existing id.
       * New player => nanoid id.
       */
      newBatsman: newPlayer,

      newPlayerPosition,

      isExtraWicket: Boolean(pendingData),
    };

    onSubmit(outData);
  };

  /*
   * Current players are shown in the player-out selector.
   * For Run Out, either striker or non-striker can be selected.
   */
  const renderPlayerOutOptions = () => (
    <>
      {striker && (
        <option value={getPlayerId(striker)}>{striker.name} (Striker)</option>
      )}

      {nonStriker && (
        <option value={getPlayerId(nonStriker)}>
          {nonStriker.name} (Non-Striker)
        </option>
      )}
    </>
  );

  const renderSuggestionList = ({
    items,
    value,
    onSelect,
    emptyMessage,
    disabledIds = [],
  }) => {
    if (!value.trim()) return null;

    return (
      <ul className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-base-content/10 bg-base-100">
        {items.length > 0 ? (
          items.map((player) => {
            const id = getPlayerId(player);
            const disabled = disabledIds.includes(id);

            return (
              <li key={id || player.name}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(player)}
                  className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm transition hover:bg-base-200 ${
                    disabled ? "cursor-not-allowed opacity-40" : ""
                  }`}
                >
                  <span>{player.name}</span>

                  {disabled && (
                    <span className="text-xs opacity-60">Already playing</span>
                  )}
                </button>
              </li>
            );
          })
        ) : (
          <li className="px-3 py-3 text-xs text-base-content/50">
            {emptyMessage}
          </li>
        )}
      </ul>
    );
  };

  const needsPosition =
    selectedWicketType === "Run Out" || selectedWicketType === "Caught";

  const needsFielder =
    selectedWicketType === "Caught" ||
    selectedWicketType === "Run Out" ||
    selectedWicketType === "Stumped";

  return (
    <div className="fixed inset-0 z-[9999999] h-dvh w-screen overflow-y-auto bg-base-100">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-base-content/10 bg-base-100/95 px-4 backdrop-blur">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-base-content/10 active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <h1 className="text-base font-semibold">Record wicket</h1>
          <p className="text-xs text-base-content/50">
            Enter the dismissal details
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 pb-10 pt-5">
        {/* EXTRA INFORMATION */}
        {pendingData && (
          <section className="mb-6 rounded-2xl border border-info/20 bg-info/10 p-4">
            <h2 className="text-sm font-semibold">Extra + Wicket</h2>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="badge badge-info">{pendingData.type}</span>

              <span className="badge badge-neutral">
                {pendingData.runs} run{pendingData.runs !== 1 ? "s" : ""}
              </span>

              {pendingData.runType && (
                <span className="badge badge-neutral">
                  {pendingData.runType}
                </span>
              )}
            </div>
          </section>
        )}

        {/* WICKET TYPE */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">How was the batsman out?</h2>
            <p className="mt-1 text-xs text-base-content/50">
              Select the type of dismissal
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {wicketTypes.map((wicket) => {
              const isSelected = selectedWicketType === wicket.type;

              return (
                <button
                  type="button"
                  key={wicket.type}
                  onClick={() => handleWicketTypeBtn(wicket.type)}
                  className={`flex min-h-16 items-center justify-between rounded-xl border px-4 text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                      : "border-base-content/10 bg-base-200/40 hover:border-base-content/20 hover:bg-base-200"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      isSelected ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {wicket.type}
                  </span>

                  {isSelected && <ShieldCheck size={18} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </section>

        {/* INPUT FIELDS */}
        <section className="mt-6 space-y-4">
          {/* PLAYER OUT */}
          <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
            <label
              htmlFor="playerOut"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <UserRound size={16} className="opacity-60" />
              Which player got out?
            </label>

            <select
              id="playerOut"
              value={playerOut}
              onChange={(e) => {
                const selectedId = e.target.value;

                setPlayerOut(selectedId);

                if (selectedId === getPlayerId(striker)) {
                  setNewPlayerPosition("striker");
                } else if (selectedId === getPlayerId(nonStriker)) {
                  setNewPlayerPosition("nonStriker");
                }
              }}
              className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none focus:border-blue-500"
            >
              {renderPlayerOutOptions()}
            </select>

            {selectedWicketType === "Run Out" && (
              <p className="mt-2 text-xs text-base-content/50">
                For a run out, choose either the striker or non-striker who was
                dismissed.
              </p>
            )}
          </div>

          {/* FIELDER / CAUGHT / RUN OUT / STUMPED */}
          {needsFielder && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <div className="mb-4 flex items-center gap-2">
                <PersonStanding size={18} />

                <div>
                  <h3 className="text-sm font-semibold">
                    {selectedWicketType === "Caught"
                      ? "Who caught the ball?"
                      : selectedWicketType === "Run Out"
                        ? "Who took the run-out?"
                        : "Who stumped?"}
                  </h3>

                  <p className="text-xs text-base-content/50">
                    {selectedWicketType === "Stumped"
                      ? "Select a bowling-team player except the bowler"
                      : "Select a player from the bowling team"}
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  id="fielder"
                  type="text"
                  value={fielder}
                  onChange={(e) => {
                    setFielder(e.target.value);
                    setNameError("");
                  }}
                  className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none placeholder:text-base-content/30 focus:border-blue-500"
                  placeholder={
                    selectedWicketType === "Stumped"
                      ? "Search wicketkeeper"
                      : "Search fielder"
                  }
                />

                {renderSuggestionList({
                  items: filteredFielders,
                  value: fielder,
                  onSelect: selectFielder,
                  emptyMessage: "No matching bowling-team player found",
                })}
              </div>
            </div>
          )}

          {/* COMPLETED RUNS */}
          {(selectedWicketType === "Run Out" ||
            selectedWicketType === "Caught") && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <label
                htmlFor="completedRuns"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <Trophy size={16} className="opacity-60" />

                {selectedWicketType === "Caught"
                  ? "Runs completed before catch"
                  : "Runs completed before run out"}
              </label>

              <input
                id="completedRuns"
                type="number"
                min="0"
                max="7"
                value={completedRuns}
                onChange={(e) => setCompletedRuns(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
          )}

          {/* NEW BATSMAN */}
          <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
            <label
              htmlFor="newBatsman"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <UserRound size={16} className="opacity-60" />
              Who is the new batsman?
            </label>

            <div className="relative">
              <input
                id="newBatsman"
                type="text"
                value={newBatsman}
                onChange={(e) => {
                  setNewBatsman(e.target.value);
                  setNameError("");
                }}
                className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none placeholder:text-base-content/30 focus:border-blue-500"
                placeholder="Search player or enter new player name"
              />

              {renderSuggestionList({
                items: filteredBatsmen,
                value: newBatsman,
                onSelect: selectNewBatsman,
                emptyMessage:
                  "No matching player found. This name will be created as a new player.",
                disabledIds: [getPlayerId(striker), getPlayerId(nonStriker)],
              })}
            </div>

            {newBatsman.trim() &&
              filteredBatsmen.length === 0 &&
              !nameError && (
                <p className="mt-2 text-xs text-info">
                  No existing player matched. A new player will be created
                  automatically if the name is valid.
                </p>
              )}

            {nameError && (
              <p className="mt-2 text-xs text-error">{nameError}</p>
            )}
          </div>

          {/* NEW BATSMAN POSITION */}
          {needsPosition && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <label
                htmlFor="strikePosition"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <UsersRound size={16} className="opacity-60" />
                New player's position
              </label>

              <p className="mb-3 text-xs text-base-content/50">
                Will the new player be on strike?
              </p>

              <select
                id="strikePosition"
                value={newPlayerPosition}
                onChange={(e) => setNewPlayerPosition(e.target.value)}
                className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="striker">Striker</option>
                <option value="nonStriker">Non-Striker</option>
              </select>
            </div>
          )}
        </section>

        {/* SUBMIT */}
        <div className="mt-6 flex w-full justify-center">
          <button
            type="button"
            onClick={handleSubmitBtn}
            className="btn btn-info h-12 w-full"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
};
