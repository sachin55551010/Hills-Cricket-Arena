import { useState } from "react";

import { ArrowLeft } from "lucide-react";
export const OutModal = ({ pendingData, onClose, onSubmit }) => {
  console.log(pendingData);
  //   console.log(onClose);
  //   console.log(onSubmit);
  const matchData = JSON.parse(localStorage.getItem("currentMatch"));
  //   console.log(matchData);

  const [selectedWicketType, setSelectedWicketType] = useState("Bowled");
  const wicketType = [
    { type: "Bowled" },
    { type: "Cought" },
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
    <div className="inset-0 z-[9999999] fixed w-screen bg-base-100 flex flex-col items-center overflow-y-auto h-dvh">
      <header className="flex items-center gap-2 px-2 py-4 fixed w-full bg-base-100">
        <div onClick={onClose}>
          <ArrowLeft size={30} strokeWidth={3} />
        </div>

        <h1>Record your wicket</h1>
      </header>
      {/* wicket record */}
      <div className="w-full p-2 lg:w-[60%] pt-15">
        <h1>How was the batsman out?</h1>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {wicketType.map((wicket) => {
            return (
              <button
                onClick={() => handleWicketTypeBtn(wicket.type)}
                className={`py-4 rounded-md ${selectedWicketType === wicket.type ? "bg-blue-600 font-bold" : "border border-base-content/15"}`}
                key={wicket.type}
              >
                {wicket.type}
              </button>
            );
          })}
        </div>

        {/* input fields */}
        <section className="mt-4 flex flex-col gap-4">
          {/* for run out */}
          {selectedWicketType === "Run Out" && (
            // no ball extra inputs
            <div className="flex flex-col gap-4">
              {/* which player got out */}
              <div>
                <label
                  htmlFor="
                    "
                  className="flex flex-col gap-2"
                >
                  Which player got out?
                  <select
                    name=""
                    id=""
                    className="w-full h-10 rounded-md border border-base-content/15 bg-base-100 outline-0"
                  >
                    <option value="">
                      {matchData?.currentPlayers?.striker?.name}
                    </option>
                    <option value="">
                      {matchData?.currentPlayers?.nonStriker?.name}
                    </option>
                  </select>
                </label>
              </div>

              {/* who took runout */}
              <div>
                <label htmlFor="runOut" className="flex flex-col gap-2">
                  Who took the run-out?
                  <input
                    id="runOut"
                    type="text"
                    className="border border-base-content/15 h-10 rounded-md pl-2 outline-0"
                    placeholder="Who took the run-out?"
                  />
                </label>
              </div>

              {/* runs fields */}
              {!pendingData && (
                <div>
                  <label htmlFor="cought" className="flex flex-col gap-2">
                    How many runs did the batsman score in the run-out?
                    <input
                      id="cought"
                      type="text"
                      className="border border-base-content/15 h-10 rounded-md pl-2 outline-0"
                      placeholder="0"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
          {/* for catch out */}
          {selectedWicketType === "Cought" && (
            <div>
              <label htmlFor="cought" className="flex flex-col gap-2">
                Who cought the ball?
                <input
                  id="cought"
                  type="text"
                  className="border border-base-content/15 h-10 rounded-md pl-2 outline-0"
                  placeholder="Who is the new batsman"
                />
              </label>
            </div>
          )}

          {/* count run if catch out */}
          {selectedWicketType === "Cought" && (
            <div>
              <label htmlFor="runs" className="flex flex-col gap-2">
                How many runs they completed before cought?
                <input
                  id="runs"
                  type="text"
                  className="border border-base-content/15 h-10 rounded-md pl-2 outline-0"
                  placeholder="0"
                />
              </label>
            </div>
          )}

          {selectedWicketType === "Stumped" && (
            <div>
              <label htmlFor="stumped" className="flex flex-col gap-2">
                Who stumped?
                <input
                  id="stumped"
                  type="text"
                  className="border border-base-content/15 h-10 rounded-md pl-2 outline-0"
                  placeholder="Who stumped"
                />
              </label>
            </div>
          )}

          {/* new batsman input */}
          <div>
            <label htmlFor="newBatsman" className="flex flex-col gap-2">
              Who is the new batsman?
              <input
                id="newBatsman"
                type="text"
                className="border border-base-content/15 h-10 rounded-md pl-2 outline-0"
                placeholder="Who is the new batsman"
              />
            </label>
          </div>

          {/* if runout or cought */}
          {strikeNonStrikerInput && (
            <div>
              <label htmlFor="" className="flex flex-col gap-2">
                Will the new player be the striker or non-striker?
                <select
                  name=""
                  id=""
                  className="w-full h-10 rounded-md border border-base-content/15 bg-base-100 outline-0"
                >
                  <option value="">Striker</option>
                  <option value="">Non-Striker</option>
                </select>
              </label>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
