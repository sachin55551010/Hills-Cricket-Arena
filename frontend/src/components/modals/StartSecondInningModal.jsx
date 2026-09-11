import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { X, Search, RotateCcw } from "lucide-react";
import { startSecondInning } from "../../store/scoreSlice";

// Keep this OUTSIDE StartSecondInningModal
const PlayerSearchSection = ({
  label,
  search,
  setSearch,
  selected,
  setSelected,
  filteredList,
  createPlayer,
}) => {
  const handleSelect = (player) => {
    setSelected(player);
    setSearch("");
  };

  const handleAddNew = () => {
    const name = search.trim();

    if (!name) return;

    const player = createPlayer(name);

    setSelected(player);
    setSearch("");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">
        {label}
      </label>

      {selected ? (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary font-semibold text-sm">
          <span>{selected.name}</span>

          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setSearch("");
            }}
            className="btn btn-circle btn-ghost btn-xs"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          {/* Don't use label here because we already have a label above */}
          <div className="input input-bordered flex h-10 items-center gap-2 rounded-xl">
            <Search
              size={15}
              className="text-base-content/40"
            />

            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow text-sm"
            />
          </div>

          {search && (
            <ul className="mt-1 rounded-xl border border-base-content/15 bg-base-100 shadow-sm max-h-36 overflow-y-auto">
              {filteredList.map((player) => (
                <li
                  key={player.playerId}
                  onClick={() => handleSelect(player)}
                  className="px-3 py-2 cursor-pointer hover:bg-base-200 text-sm"
                >
                  {player.name}
                </li>
              ))}

              {filteredList.length === 0 && (
                <li
                  onClick={handleAddNew}
                  className="px-3 py-2 cursor-pointer hover:bg-base-200 text-sm text-info"
                >
                  Add "{search}" as new player
                </li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export const StartSecondInningModal = ({ onClose, onUndo }) => {
  const dispatch = useDispatch();

  const { currentMatchData } = useSelector(
    (state) => state.score
  );

  const { teams } = useSelector(
    (state) => state.localTeam
  );

  // In inning 1: battingTeamId was the batting team.
  // In inning 2: teams SWAP.
  const inning1 = currentMatchData?.innings?.[0];

  const newBattingTeamId = inning1?.bowlingTeamId;
  const newBowlingTeamId = inning1?.battingTeamId;

  const newBattingTeam =
    teams.find((t) => t.teamId === newBattingTeamId) ||
    (currentMatchData?.firstTeam?.teamId === newBattingTeamId
      ? currentMatchData.firstTeam
      : currentMatchData.secondTeam);

  const newBowlingTeam =
    teams.find((t) => t.teamId === newBowlingTeamId) ||
    (currentMatchData?.firstTeam?.teamId === newBowlingTeamId
      ? currentMatchData.firstTeam
      : currentMatchData.secondTeam);

  const battingPlayers = newBattingTeam?.players || [];
  const bowlingPlayers = newBowlingTeam?.players || [];

  const [strikerSearch, setStrikerSearch] = useState("");
  const [nonStrikerSearch, setNonStrikerSearch] = useState("");
  const [bowlerSearch, setBowlerSearch] = useState("");

  const [selectedStriker, setSelectedStriker] = useState(null);
  const [selectedNonStriker, setSelectedNonStriker] = useState(null);
  const [selectedBowler, setSelectedBowler] = useState(null);

  const createPlayer = (name) => ({
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
  });

  const getFilteredPlayers = (
    players,
    search,
    excludeIds = []
  ) =>
    players.filter(
      (p) =>
        p.name
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        !excludeIds.includes(p.playerId)
    );

  const strikerExclude = [
    selectedNonStriker?.playerId,
  ].filter(Boolean);

  const nonStrikerExclude = [
    selectedStriker?.playerId,
  ].filter(Boolean);

  const filteredStrikers = getFilteredPlayers(
    battingPlayers,
    strikerSearch,
    strikerExclude
  );

  const filteredNonStrikers = getFilteredPlayers(
    battingPlayers,
    nonStrikerSearch,
    nonStrikerExclude
  );

  const filteredBowlers = getFilteredPlayers(
    bowlingPlayers,
    bowlerSearch
  );

  const canStart =
    selectedStriker &&
    selectedNonStriker &&
    selectedBowler;

  const handleStart = () => {
    if (!canStart) return;

    dispatch(
      startSecondInning({
        striker: selectedStriker,
        nonStriker: selectedNonStriker,
        bowler: selectedBowler,

        newBattingTeamId,
        newBowlingTeamId,

        newBattingTeamName: newBattingTeam?.name,
        newBowlingTeamName: newBowlingTeam?.name,
      })
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-base-100 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Start 2nd Inning
            </h2>

            <p className="mt-0.5 text-xs text-base-content/50">
              {newBattingTeam?.name} will bat — select opening players
            </p>
          </div>

          {onUndo && (
            <button
              type="button"
              onClick={onUndo}
              className="btn btn-sm btn-ghost gap-1 text-warning border border-warning/40 rounded-xl"
              title="Undo last delivery and go back"
            >
              <RotateCcw size={15} />
              Undo
            </button>
          )}
        </div>

        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">

          {/* Target */}
          {inning1 && (
            <div className="mb-4 rounded-xl bg-warning/15 border border-warning/30 px-4 py-3 text-center">
              <p className="text-sm font-semibold text-warning">
                Target: {inning1.runs + 1} runs in{" "}
                {currentMatchData?.totalOvers ??
                  currentMatchData?.overs}{" "}
                overs
              </p>

              <p className="text-xs text-base-content/60 mt-0.5">
                {newBattingTeam?.name} needs{" "}
                {inning1.runs + 1} runs to win
              </p>
            </div>
          )}

          <PlayerSearchSection
            label="Opening Striker"
            search={strikerSearch}
            setSearch={setStrikerSearch}
            selected={selectedStriker}
            setSelected={setSelectedStriker}
            filteredList={filteredStrikers}
            createPlayer={createPlayer}
          />

          <PlayerSearchSection
            label="Opening Non-Striker"
            search={nonStrikerSearch}
            setSearch={setNonStrikerSearch}
            selected={selectedNonStriker}
            setSelected={setSelectedNonStriker}
            filteredList={filteredNonStrikers}
            createPlayer={createPlayer}
          />

          <PlayerSearchSection
            label="Opening Bowler"
            search={bowlerSearch}
            setSearch={setBowlerSearch}
            selected={selectedBowler}
            setSelected={setSelectedBowler}
            filteredList={filteredBowlers}
            createPlayer={createPlayer}
          />
        </div>

        <div className="border-t border-base-200 p-4">
          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart}
            className="btn btn-primary w-full rounded-xl disabled:opacity-40"
          >
            Start 2nd Inning
          </button>
        </div>
      </div>
    </div>
  );
};