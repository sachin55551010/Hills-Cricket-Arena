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

export const OutModal = ({ pendingData, onClose, onSubmit }) => {
  console.log(pendingData);
  //   console.log(onClose);
  //   console.log(onSubmit);
  const matchData = JSON.parse(localStorage.getItem("currentMatch"));
  //   console.log(matchData);

  const [selectedWicketType, setSelectedWicketType] = useState("Bowled");
  const wicketType = [
    { type: "Bowled" },
    { type: "Caught" },
    { type: "Run Out" },
    { type: "LBW" },
    { type: "Stumped" },
    { type: "Hit Wicket" },
    { type: "Obstructing Field" },
    { type: "Hitt Ball Twice" },
  ];

  const handleWicketTypeBtn = (type) => {
    setSelectedWicketType(type);
  };

  const strikeNonStrikerInput =
    selectedWicketType === "Run Out" || selectedWicketType === "Cought";

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
        {/* Wicket type */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">How was the batsman out?</h2>
            <p className="mt-1 text-xs text-base-content/50">
              Select the type of dismissal
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {wicketType.map((wicket) => {
              const isSelected = selectedWicketType === wicket.type;

              return (
                <button
                  key={wicket.type}
                  onClick={() => handleWicketTypeBtn(wicket.type)}
                  className={`
                  flex min-h-16 items-center justify-between rounded-xl
                  border px-4 text-left transition-all
                  active:scale-[0.98]
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

        {/* Input fields */}
        <section className="mt-6 space-y-4">
          {/* Run Out */}
          {selectedWicketType === "Run Out" && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <div className="mb-4 flex items-center gap-2">
                <PersonStanding size={18} />
                <div>
                  <h3 className="text-sm font-semibold">Run out details</h3>
                  <p className="text-xs text-base-content/50">
                    Enter the details of the run out
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Which player got out */}
                <div>
                  <label
                    htmlFor="playerOut"
                    className="mb-2 flex items-center gap-2 text-sm font-medium"
                  >
                    <UserRound size={16} className="opacity-60" />
                    Which player got out?
                  </label>

                  <select
                    name=""
                    id="playerOut"
                    className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition focus:border-blue-500"
                  >
                    <option value="">
                      {matchData?.currentPlayers?.striker?.name}
                    </option>

                    <option value="">
                      {matchData?.currentPlayers?.nonStriker?.name}
                    </option>
                  </select>
                </div>

                {/* Who took run out */}
                <div>
                  <label
                    htmlFor="runOut"
                    className="mb-2 flex items-center gap-2 text-sm font-medium"
                  >
                    <UsersRound size={16} className="opacity-60" />
                    Who took the run-out?
                  </label>

                  <input
                    id="runOut"
                    type="text"
                    className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:border-blue-500"
                    placeholder="Enter fielder name"
                  />
                </div>

                {/* Runs */}
                {!pendingData && (
                  <div>
                    <label
                      htmlFor="cought"
                      className="mb-2 flex items-center gap-2 text-sm font-medium"
                    >
                      <Trophy size={16} className="opacity-60" />
                      Runs completed
                    </label>

                    <input
                      id="cought"
                      type="text"
                      className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caught */}
          {selectedWicketType === "Caught" && (
            <>
              <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
                <label
                  htmlFor="cought"
                  className="mb-2 flex items-center gap-2 text-sm font-medium"
                >
                  <CircleUserRound size={16} className="opacity-60" />
                  Who caught the ball?
                </label>

                <input
                  id="cought"
                  type="text"
                  className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:border-blue-500"
                  placeholder="Enter fielder name"
                />
              </div>

              <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
                <label
                  htmlFor="runs"
                  className="mb-2 flex items-center gap-2 text-sm font-medium"
                >
                  <Trophy size={16} className="opacity-60" />
                  Runs completed before catch
                </label>

                <input
                  id="runs"
                  type="text"
                  className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* Stumped */}
          {selectedWicketType === "Stumped" && (
            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 p-4">
              <label
                htmlFor="stumped"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <CircleUserRound size={16} className="opacity-60" />
                Who stumped?
              </label>

              <input
                id="stumped"
                type="text"
                className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:border-blue-500"
                placeholder="Enter wicketkeeper name"
              />
            </div>
          )}

          {/* New batsman */}
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
              className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:border-blue-500"
              placeholder="Enter batsman name"
            />
          </div>

          {/* Strike / Non-striker */}
          {strikeNonStrikerInput && (
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
                name=""
                id="strikePosition"
                className="h-11 w-full rounded-xl border border-base-content/10 bg-base-100 px-3 text-sm outline-none transition focus:border-blue-500"
              >
                <option value="">Striker</option>
                <option value="">Non-Striker</option>
              </select>
            </div>
          )}
        </section>
        <div className="flex mt-4 w-full justify-center">
          <button className="btn btn-info w-50 h-12">Submit</button>
        </div>
      </main>
    </div>
  );
};

/**
 * in my out modal there are different type of data could be send like for bolwed who is new batsman name and also add nanoid id for it

if caught out who caught the ball name and nanoid id, who is new batsman name and id, will the player be striker or non striker end

for runout which player got out who took the runout, how many runs batsman score in the run out,who is the new batsman, will player be on strike on non strike,

for stumped, who stumped and new batsman,

for other option only who is the new batsman is available
 */
