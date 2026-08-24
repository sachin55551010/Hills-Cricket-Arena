import { useState } from "react";

import { ArrowLeft, Check, Plus, Search, UserRound, X } from "lucide-react";

const bowlers = [
  { id: 1, name: "Jasprit Bumrah", team: "India" },
  { id: 2, name: "Mohammed Shami", team: "India" },
  { id: 3, name: "Kuldeep Yadav", team: "India" },
  { id: 4, name: "Ravindra Jadeja", team: "India" },
];

export const AddNewBowlerModal = ({ onClose }) => {
  const [showAddBowler, setShowAddBowler] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [search, setSearch] = useState("");
  const [newBowlerName, setNewBowlerName] = useState("");

  const filteredBowlers = bowlers.filter((bowler) =>
    bowler.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddBowler = () => {
    if (!newBowlerName.trim()) return;

    console.log("New bowler:", newBowlerName);

    setNewBowlerName("");
    setShowAddBowler(false);
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
        </div>

        {/* Bowler List */}
        <div className="max-h-[380px] space-y-2 overflow-y-auto px-5 py-4">
          {filteredBowlers.length > 0 ? (
            filteredBowlers.map((bowler) => {
              const isSelected = selectedBowler?.id === bowler.id;

              return (
                <button
                  key={bowler.id}
                  onClick={() => setSelectedBowler(bowler)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-info bg-info/10"
                      : "border-base-200 hover:border-base-300 hover:bg-base-200/50"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      isSelected
                        ? "bg-info text-info-content"
                        : "bg-base-200 text-base-content/50"
                    }`}
                  >
                    <UserRound size={20} />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {bowler.name}
                    </p>

                    <p className="text-xs text-base-content/50">
                      {bowler.team}
                    </p>
                  </div>

                  {/* Selected */}
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-info bg-info text-info-content"
                        : "border-base-300"
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-base-200">
                <UserRound size={20} className="text-base-content/40" />
              </div>

              <p className="text-sm font-medium">No bowler found</p>
              <p className="mt-1 text-xs text-base-content/50">
                Try searching another name
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-base-200 bg-base-100 p-4">
          <div className="flex gap-2">
            {/* Undo */}
            <button
              onClick={() => setSelectedBowler(null)}
              disabled={!selectedBowler}
              className="btn btn-ghost flex-1 rounded-xl"
            >
              Undo
            </button>

            {/* Add New */}
            <button
              onClick={() => setShowAddBowler(true)}
              className="btn btn-info flex-1 rounded-xl"
            >
              <Plus size={18} />
              Add New Bowler
            </button>
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

      {/* Add New Bowler Popup */}

      {showAddBowler && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-3xl bg-base-100 p-5 shadow-2xl">
            {/* Popup Header */}
            <div className="mb-5 flex items-center gap-3">
              <button
                onClick={() => setShowAddBowler(false)}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <h3 className="font-semibold">Add New Bowler</h3>
                <p className="text-xs text-base-content/50">
                  Add a player to the bowling lineup
                </p>
              </div>
            </div>

            {/* Input */}
            <div>
              <label className="mb-2 block text-xs font-medium text-base-content/60">
                Bowler name
              </label>

              <input
                autoFocus
                type="text"
                value={newBowlerName}
                onChange={(e) => setNewBowlerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddBowler();
                  }
                }}
                placeholder="Enter player name"
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowAddBowler(false)}
                className="btn btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleAddBowler}
                disabled={!newBowlerName.trim()}
                className="btn btn-info flex-1 rounded-xl"
              >
                <Plus size={17} />
                Add Bowler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
