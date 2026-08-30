import { useState } from "react";
import {
  ArrowLeft,
  CircleUserRound,
  UserRound,
  ShieldCheck,
  Trophy,
  UsersRound,
  PersonStanding,
} from "lucide-react";
import { useSelector } from "react-redux";

export const OutModal = ({ pendingData = null, onClose, onSubmit }) => {
  const { currentMatchData } = useSelector((state) => state.score);
  console.log(currentMatchData);

  const [selectedWicketType, setSelectedWicketType] = useState("Bowled");

  const [playerOut, setPlayerOut] = useState(
    currentMatchData?.currentPlayers?.striker?.id || "",
  );

  const [fielder, setFielder] = useState("");
  const [completedRuns, setCompletedRuns] = useState(0);
  const [newBatsman, setNewBatsman] = useState("");
  const [newPlayerPosition, setNewPlayerPosition] = useState("STRIKER");

  // batting team id to get batting team player list
  const currentInning =
    currentMatchData?.innings[currentMatchData.currentInning - 1];

  const battingTeamPlayer =
    currentInning.battingTeamId === currentMatchData.firstTeam.teamId
      ? currentMatchData.firstTeam.players
      : currentMatchData.secondTeam.players;

  // const bowlingTeamPlayers =
  //   currentInning.bowlingTeamId === currentMatchData.firstTeam.teamId
  //     ? currentMatchData.firstTeam.players
  //     : currentMatchData.secondTeam.players;

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
  const battingTeamPlayerList = battingTeamPlayer.filter((player) =>
    player.name.toLowerCase().includes(newBatsman.toLowerCase()),
  );
  /*
   * These are the dismissals where the position of
   * the new batsman matters.
   *
   * You can change this depending on how you want
   * your scoring app to handle strike.
   */
  const needsPosition =
    selectedWicketType === "Run Out" || selectedWicketType === "Caught";

  const handleWicketTypeBtn = (type) => {
    setSelectedWicketType(type);

    // Reset values when changing dismissal type
    if (type !== "Run Out") {
      setPlayerOut(currentMatchData?.currentPlayers?.striker?.id || "");
    }

    if (type !== "Caught") {
      setFielder("");
    }

    setCompletedRuns(0);
  };

  const handleSubmitBtn = () => {
    if (!newBatsman.trim()) {
      alert("Please enter the new batsman.");
      return;
    }

    const outData = {
      wicket: true,

      wicketType: selectedWicketType,

      playerOut,

      fielder: fielder.trim() || null,

      completedRuns: Number(completedRuns) || 0,

      newBatsman: newBatsman.trim(),

      newPlayerPosition,

      isExtraWicket: Boolean(pendingData),
    };

    onSubmit(outData);
  };

  const selectedPlayer = (player) => {
    const playerName = player.name.trim().toLowerCase();
    console.log("player name", playerName);

    const strikerName = currentMatchData.currentPlayers.striker?.name
      ?.trim()
      .toLowerCase();

    const nonStrikerName = currentMatchData.currentPlayers.nonStriker?.name
      ?.trim()
      .toLowerCase();

    const bowlerName = currentMatchData.currentPlayers.bowler?.name
      ?.trim()
      .toLowerCase();

    return (
      playerName === strikerName ||
      playerName === nonStrikerName ||
      playerName === bowlerName
    );
  };

  const renderPlayers = (player) => {
    const selected = selectedPlayer(player);

    return (
      <li key={player.playerId} className={selected ? "opacity-50" : ""}>
        {player.name}
      </li>
    );
  };

  /*
   * Current players
   */
  const striker = currentMatchData?.currentPlayers?.striker;
  const nonStriker = currentMatchData?.currentPlayers?.nonStriker;

  return (
    <div className="fixed inset-0 z-[9999999] h-dvh w-screen overflow-y-auto bg-base-100">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-base-content/10 bg-base-100/95 px-4 backdrop-blur">
        <button
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

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl px-4 pb-10 pt-5">
        {/* -----------------------------------------
            EXTRA INFORMATION
        ------------------------------------------ */}

        {pendingData && (
          <section className="mb-6 rounded-2xl border border-info/20 bg-info/10 p-4">
            <h2 className="text-sm font-semibold">Extra + Wicket</h2>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="badge badge-info">{pendingData.type}</span>

              <span className="badge badge-neutral">
                {pendingData.runs} run
                {pendingData.runs !== 1 ? "s" : ""}
              </span>

              {pendingData.runType && (
                <span className="badge badge-neutral">
                  {pendingData.runType}
                </span>
              )}
            </div>
          </section>
        )}

        {/* -----------------------------------------
            WICKET TYPE
        ------------------------------------------ */}

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
                  key={wicket.type}
                  onClick={() => handleWicketTypeBtn(wicket.type)}
                  className={`
                    flex min-h-16 items-center justify-between
                    rounded-xl border px-4 text-left
                    transition-all active:scale-[0.98]
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                        : "border-base-content/10 bg-base-200/40 hover:border-base-content/20 hover:bg-base-200"
                    }
                  `}
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

        {/* -----------------------------------------
            INPUT FIELDS
        ------------------------------------------ */}

        <section className="mt-6 space-y-4">
          {/* ---------------------------------------
              PLAYER OUT
          ---------------------------------------- */}

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
              onChange={(e) => setPlayerOut(e.target.value)}
              className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value={striker?.id || "striker"}>
                {striker?.name || "Striker"}
              </option>

              <option value={nonStriker?.id || "nonStriker"}>
                {nonStriker?.name || "Non-Striker"}
              </option>
            </select>
          </div>

          {/* ---------------------------------------
              RUN OUT DETAILS
          ---------------------------------------- */}

          {selectedWicketType === "Run Out" && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <div className="mb-4 flex items-center gap-2">
                <PersonStanding size={18} />

                <div>
                  <h3 className="text-sm font-semibold">Run out details</h3>

                  <p className="text-xs text-base-content/50">
                    Enter run-out information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Fielder */}
                <div>
                  <label
                    htmlFor="runOutFielder"
                    className="mb-2 flex items-center gap-2 text-sm font-medium"
                  >
                    <UsersRound size={16} className="opacity-60" />
                    Who took the run-out?
                  </label>

                  <input
                    id="runOutFielder"
                    type="text"
                    value={fielder}
                    onChange={(e) => setFielder(e.target.value)}
                    className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none placeholder:text-base-content/30 focus:border-blue-500"
                    placeholder="Enter fielder name"
                  />
                </div>

                {/* Completed runs */}
                <div>
                  <label
                    htmlFor="completedRuns"
                    className="mb-2 flex items-center gap-2 text-sm font-medium"
                  >
                    <Trophy size={16} className="opacity-60" />
                    Runs completed
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
              </div>
            </div>
          )}

          {/* ---------------------------------------
              CAUGHT
          ---------------------------------------- */}

          {selectedWicketType === "Caught" && (
            <>
              <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
                <label
                  htmlFor="caughtBy"
                  className="mb-2 flex items-center gap-2 text-sm font-medium"
                >
                  <CircleUserRound size={16} className="opacity-60" />
                  Who caught the ball?
                </label>

                <input
                  id="caughtBy"
                  type="text"
                  value={fielder}
                  onChange={(e) => setFielder(e.target.value)}
                  className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none placeholder:text-base-content/30 focus:border-blue-500"
                  placeholder="Enter fielder name"
                />
              </div>

              <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
                <label
                  htmlFor="caughtRuns"
                  className="mb-2 flex items-center gap-2 text-sm font-medium"
                >
                  <Trophy size={16} className="opacity-60" />
                  Runs completed before catch
                </label>

                <input
                  id="caughtRuns"
                  type="number"
                  min="0"
                  max="7"
                  value={completedRuns}
                  onChange={(e) => setCompletedRuns(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* ---------------------------------------
              STUMPED
          ---------------------------------------- */}

          {selectedWicketType === "Stumped" && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <label
                htmlFor="stumpedBy"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <CircleUserRound size={16} className="opacity-60" />
                Who stumped?
              </label>

              <input
                id="stumpedBy"
                type="text"
                value={fielder}
                onChange={(e) => setFielder(e.target.value)}
                className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none placeholder:text-base-content/30 focus:border-blue-500"
                placeholder="Enter wicketkeeper name"
              />
            </div>
          )}

          {/* ---------------------------------------
              NEW BATSMAN
          ---------------------------------------- */}

          <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
            <label
              htmlFor="newBatsman"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <UserRound size={16} className="opacity-60" />
              Who is the new batsman?
            </label>

            <input
              id="newBatsman"
              type="text"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
              className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none placeholder:text-base-content/30 focus:border-blue-500"
              placeholder="Enter batsman name"
            />
            <ul>
              {battingTeamPlayerList.length > 0 ? (
                newBatsman &&
                battingTeamPlayerList.map((player) => {
                  return renderPlayers(player);
                })
              ) : (
                <li>
                  No player found in the list it will save as a new player
                </li>
              )}
            </ul>
          </div>

          {/* ---------------------------------------
              NEW BATSMAN POSITION
          ---------------------------------------- */}

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
                <option value="STRIKER">Striker</option>

                <option value="NON_STRIKER">Non-Striker</option>
              </select>
            </div>
          )}
        </section>

        {/* -----------------------------------------
            SUBMIT
        ------------------------------------------ */}

        <div className="mt-6 flex w-full justify-center">
          <button
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
