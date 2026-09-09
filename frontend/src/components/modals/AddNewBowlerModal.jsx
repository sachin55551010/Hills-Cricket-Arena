import { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeft, Plus, Search, X } from "lucide-react";
import { nanoid } from "zod";

export const AddNewBowlerModal = ({ onClose, updateNewBowler }) => {
  const [showAddBowler, setShowAddBowler] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [search, setSearch] = useState("");
  const [newBowlerName, setNewBowlerName] = useState("");

  const { teams } = useSelector((state) => state.localTeam);

  const { currentMatchData } = useSelector((state) => state.score);

  const bowlingTeamId =
    currentMatchData?.innings[currentMatchData.currentInning - 1].bowlingTeamId;

  const bowlingTeam = teams.find((team) => team.teamId === bowlingTeamId);
  const bowlingTeamPlayers = bowlingTeam.players;
  const filteredBowlersList = bowlingTeamPlayers.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase()),
  );

  console.log(currentMatchData);

  const lastbowler = currentMatchData?.currentPlayers?.bowler;

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

  const handleAddBowler = () => {
    if (!newBowlerName.trim()) return;

    console.log("New bowler:", newBowlerName);

    setNewBowlerName("");
    setShowAddBowler(false);
  };

  const hanleClickPlayerBtn = (player) => {
    console.log(player);
    if (!player) {
      createPlayer(search);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-base-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Choose Bowler</h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Select the bowler for this over
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

          {search && (
            <ul className="flex flex-col gap-2 mt-2">
              {filteredBowlersList.map((player) => {
                const isLastBowler = player.playerId === lastbowler?.playerId;

                return (
                  <li
                    key={player.playerId}
                    onClick={() => {
                      if (!isLastBowler) {
                        hanleClickPlayerBtn(player);
                      }
                    }}
                    className={
                      isLastBowler
                        ? "text-base-content/20 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  >
                    {player.name}
                  </li>
                );
              })}

              {filteredBowlersList.length === 0 && (
                <div className="mt-2">
                  No player found. This name will be added as a new player.
                </div>
              )}
            </ul>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-base-200 bg-base-100 p-4">
          <div className="flex gap-2">
            {/* Undo */}
            <button
              onClick={() => {
                setSelectedBowler(null);
              }}
              disabled={!selectedBowler}
              className="btn btn-ghost flex-1 rounded-xl"
            >
              Undo
            </button>

            {/* Add New */}

            {filteredBowlersList.length === 0 && search && (
              <button
                onClick={() => setShowAddBowler(true)}
                className="btn btn-info flex-1 rounded-xl"
              >
                <Plus size={18} />
                Add New Bowler
              </button>
            )}
          </div>

          {/* Continue */}
          {selectedBowler && (
            <button
              className="btn btn-primary mt-2 w-full rounded-xl"
              onClick={() => {
                console.log("Selected:", selectedBowler);
              }}
            >
              Choose {selectedBowler.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
