import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Search, X } from "lucide-react";
import { nanoid } from "nanoid";
import { addPlayerToTeam } from "../../store/localTeamSlice";
import { setNewBowler } from "../../store/scoreSlice";

export const AddNewBowlerModal = ({ onClose }) => {
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const { teams } = useSelector((state) => state.localTeam);
  const { currentMatchData } = useSelector((state) => state.score);

  const bowlingTeamId =
    currentMatchData?.innings[currentMatchData.currentInning - 1].bowlingTeamId;

  const bowlingTeam = teams.find((team) => team.teamId === bowlingTeamId);
  const bowlingTeamPlayers = bowlingTeam.players;
  const filteredBowlersList = bowlingTeamPlayers.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase()),
  );

  const lastBowler = currentMatchData?.currentPlayers?.bowler;

  // create new player
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

  const handleConfirmBowler = (player) => {
    if (!player) return;
    // Dispatch the new bowler to the store
    dispatch(setNewBowler(player));
    onClose();
  };

  const handleAddNewBowler = () => {
    if (!search.trim()) return;
    const newPlayer = createPlayer(search);
    // Add to the team roster
    dispatch(
      addPlayerToTeam({
        teamId: bowlingTeamId,
        player: newPlayer,
      }),
    );
    // Set as the current bowler
    handleConfirmBowler(newPlayer);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-base-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Choose Bowler</h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Over completed! Select the bowler for the next over
            </p>
          </div>

          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <label className="input input-bordered flex h-11 items-center gap-2 rounded-xl">
            <Search size={17} className="text-base-content/40" />

            <input
              type="text"
              placeholder="Search bowler..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow text-sm"
            />
          </label>
        </div>

        {/* Player List */}
        <div className="px-5 py-3 max-h-60 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {filteredBowlersList.map((player) => {
              const isLastBowler =
                player.playerId === lastBowler?.playerId;
              const isSelected =
                selectedBowler?.playerId === player.playerId;

              return (
                <li
                  key={player.playerId}
                  onClick={() => {
                    if (!isLastBowler) {
                      setSelectedBowler(player);
                    }
                  }}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isLastBowler
                      ? "text-base-content/20 cursor-not-allowed bg-base-200/50"
                      : isSelected
                        ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                        : "hover:bg-base-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{player.name}</span>
                    {isLastBowler && (
                      <span className="text-xs text-base-content/30">
                        Last bowler
                      </span>
                    )}
                  </div>
                </li>
              );
            })}

            {filteredBowlersList.length === 0 && search && (
              <div className="mt-2 text-sm text-base-content/50">
                No player found. You can add "{search}" as a new bowler.
              </div>
            )}
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-base-200 bg-base-100 p-4">
          <div className="flex gap-2">
            {/* Add New Bowler */}
            {filteredBowlersList.length === 0 && search && (
              <button
                onClick={handleAddNewBowler}
                className="btn btn-info flex-1 rounded-xl"
              >
                <Plus size={18} />
                Add "{search}"
              </button>
            )}
          </div>

          {/* Confirm Selected Bowler */}
          {selectedBowler && (
            <button
              className="btn btn-primary mt-2 w-full rounded-xl"
              onClick={() => handleConfirmBowler(selectedBowler)}
            >
              Choose {selectedBowler.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
