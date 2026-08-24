import { useState } from "react";

import {
  X,
  UserRound,
  UserRoundX,
  ArrowLeftRight,
  ChevronRight,
  CircleDot,
} from "lucide-react";

export const MoreOptionScoringModal = ({ onClose }) => {
  const [activeOption, setActiveOption] = useState(null);

  const options = [
    {
      id: "retired-hurt",
      title: "Retired Hurt",
      description: "Retire a player due to injury or discomfort.",
      icon: UserRoundX,
    },
    {
      id: "retired-out",
      title: "Retired Out",
      description: "Retire a player from the innings.",
      icon: UserRound,
    },
    {
      id: "replace",
      title: "Replace Player",
      description: "Replace the current batsman or bowler.",
      icon: ArrowLeftRight,
    },
  ];

  const renderPlayerSelect = (title, placeholder) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-base-content">{title}</label>

      <div className="relative">
        <select className="select select-bordered w-full h-12 rounded-xl bg-base-200/60">
          <option value="">{placeholder}</option>
          <option>Player 1</option>
          <option>Player 2</option>
          <option>Player 3</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-base-300" />
        <span className="text-xs text-base-content/40">OR</span>
        <div className="h-px flex-1 bg-base-300" />
      </div>

      <input
        type="text"
        placeholder="Enter new player name"
        className="input input-bordered w-full h-12 rounded-xl bg-base-200/60"
      />
    </div>
  );

  const renderRetirement = () => (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => setActiveOption(null)}
          className="btn btn-ghost btn-sm -ml-2 gap-1"
        >
          <ChevronRight className="rotate-180" size={17} />
          Back
        </button>

        <h2 className="text-xl font-bold mt-2">
          {activeOption === "retired-hurt" ? "Retired Hurt" : "Retired Out"}
        </h2>

        <p className="text-sm text-base-content/50 mt-1">
          Select the player who is retiring and choose their replacement.
        </p>
      </div>

      {renderPlayerSelect("Retiring Player", "Choose player to retire")}

      {renderPlayerSelect(
        "Replacement Player",
        "Select replacement from available players",
      )}

      <button className="btn btn-primary w-full h-12 rounded-xl">
        Confirm{" "}
        {activeOption === "retired-hurt" ? "Retired Hurt" : "Retired Out"}
      </button>
    </div>
  );

  const renderReplacement = () => (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => setActiveOption(null)}
          className="btn btn-ghost btn-sm -ml-2 gap-1"
        >
          <ChevronRight className="rotate-180" size={17} />
          Back
        </button>

        <h2 className="text-xl font-bold mt-2">Replace Player</h2>

        <p className="text-sm text-base-content/50 mt-1">
          Choose whether you want to replace a batsman or bowler.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="replaceType"
            className="peer hidden"
            defaultChecked
          />

          <div className="rounded-xl border border-base-300 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/10">
            <CircleDot className="mx-auto mb-2 text-primary" size={20} />
            <span className="text-sm font-semibold">Batsman</span>
          </div>
        </label>

        <label className="cursor-pointer">
          <input type="radio" name="replaceType" className="peer hidden" />

          <div className="rounded-xl border border-base-300 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/10">
            <CircleDot className="mx-auto mb-2 text-primary" size={20} />
            <span className="text-sm font-semibold">Bowler</span>
          </div>
        </label>
      </div>

      {renderPlayerSelect(
        "Player to Replace",
        "Choose batsman from current players",
      )}

      {renderPlayerSelect("New Player", "Select available batsman")}

      <button className="btn btn-primary w-full h-12 rounded-xl">
        Confirm Replacement
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center backdrop-blur-md p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-base-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col border-t-2 border-base-content/15">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300/70">
          <div>
            <h1 className="text-lg font-bold">
              {activeOption ? "Player Options" : "More Options"}
            </h1>

            {!activeOption && (
              <p className="text-xs text-base-content/50 mt-0.5">
                Manage players during the innings
              </p>
            )}
          </div>

          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5">
          {!activeOption && (
            <div className="space-y-3">
              {options.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveOption(option.id)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-base-300/70 bg-base-200/30 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm">{option.title}</h3>

                      <p className="mt-0.5 text-xs leading-relaxed text-base-content/50">
                        {option.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-base-content/30 group-hover:text-primary transition-colors"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {(activeOption === "retired-hurt" ||
            activeOption === "retired-out") &&
            renderRetirement()}

          {activeOption === "replace" && renderReplacement()}
        </div>
      </div>
    </div>
  );
};
