import { useEffect, useRef, useState } from "react";
import { ExtraRunCountModal } from "../components/modals/ExtraRunCountModal";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { OutModal } from "../components/modals/OutModal";
import { MoreOptionScoringModal } from "../components/modals/MoreOptionScoringModal";
import { AddNewBowlerModal } from "../components/modals/AddNewBowlerModal";

export const ScoringPage = () => {
  const matchData = JSON.parse(localStorage.getItem("currentMatch")) || {};

  const [currentMatchData, setCurrentMatchData] = useState(() => {
    return JSON.parse(localStorage.getItem("currentMatch"));
  });
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [extraType, setExtraType] = useState("");
  const [showOutModal, setShowOutModal] = useState(false);
  const scoringButton = [
    "0",
    "1",
    "2",
    "MORE",
    "UNDO",
    "3",
    "4",
    "6",
    "...",
    "SWAP",
    "WD",
    "NB",
    "LB",
    "BYE",
    "OUT",
  ];

  const [openAddBowlerModal, setOpenAddBowlerModal] = useState(false);
  const [openMoreMotionModal, setOpenMoreOptionModal] = useState(false);
  const [matchHistory, setMatchHistory] = useState(() => []);

  const currentInning = currentMatchData.innings.length - 1;

  const totalRuns = currentMatchData.innings[currentInning].runs;
  const legalBalls = currentMatchData.innings[currentInning].legalBalls;
  const wicketsOut = currentMatchData.innings[currentInning].wickets;
  const currentRunRate = legalBalls > 0 ? (totalRuns / legalBalls) * 6 : 0;
  const noBallRuns = currentMatchData.noBallRun;
  const wideBallRuns = currentMatchData.wideBallRun;

  const onConfirm = (data) => {
    console.log("Data", data);

    const extraType = data.type;
    const extraRuns = Number(data.runs);
    const runType = data.runType; // BAT | BYE | LB
    setMatchHistory((prevHistory) => [
      ...prevHistory,
      structuredClone(currentMatchData),
    ]);
    setCurrentMatchData((prev) => {
      const lastInningIndex = prev.innings.length - 1;

      return {
        ...prev,

        // UPDATE INNINGS

        innings: prev.innings.map((inning, index) =>
          index === lastInningIndex
            ? {
                ...inning,

                // Total innings/team runs
                runs:
                  inning.runs +
                  (extraType === "WD"
                    ? wideBallRuns + extraRuns
                    : extraType === "NB"
                      ? noBallRuns + extraRuns
                      : extraRuns),

                // =========================
                // UPDATE EXTRAS
                // =========================
                extras: {
                  ...inning.extras,

                  // Wide
                  ...(extraType === "WD" && {
                    wideBallRun:
                      inning.extras.wideBallRun + wideBallRuns + extraRuns,
                  }),

                  // No Ball
                  ...(extraType === "NB" && {
                    noBallRun: inning.extras.noBallRun + noBallRuns,
                  }),

                  // Normal Bye
                  ...(extraType === "BYE" && {
                    byes: inning.extras.byes + extraRuns,
                  }),

                  // Normal Leg Bye
                  ...(extraType === "LB" && {
                    legByes: inning.extras.legByes + extraRuns,
                  }),

                  // No Ball + Bye
                  ...(extraType === "NB" &&
                    runType === "BYE" && {
                      byes: inning.extras.byes + extraRuns,
                    }),

                  // No Ball + Leg Bye
                  ...(extraType === "NB" &&
                    runType === "LB" && {
                      legByes: inning.extras.legByes + extraRuns,
                    }),
                },
              }
            : inning,
        ),

        // UPDATE CURRENT PLAYERS

        currentPlayers:
          extraType === "NB" && runType === "BAT"
            ? {
                ...prev.currentPlayers,

                striker: {
                  ...prev.currentPlayers.striker,

                  // No-ball runs from bat go to striker
                  Runs: prev.currentPlayers.striker.Runs + extraRuns,

                  // No ball is NOT a legal delivery
                  Balls: prev.currentPlayers.striker.Balls,
                },
              }
            : prev.currentPlayers,
      };
    });
  };
  // console.log("extra type data", extraTypeData);
  // console.log(currentMatchData);

  // swap batsman
  function swapBatsman(val) {
    if (["1", "3", "SWAP"].includes(val)) {
      setCurrentMatchData((prev) => ({
        ...prev,
        currentPlayers: {
          ...prev.currentPlayers,
          striker: prev.currentPlayers.nonStriker,
          nonStriker: prev.currentPlayers.striker,
        },
      }));
    }
  }
  // handle update score function
  const handleScoreBtnClick = (val) => {
    if (["0", "1", "2", "3", "4", "6"].includes(val)) {
      const numRuns = Number(val);

      // Save the CURRENT state before this action
      setMatchHistory((prevHistory) => [
        ...prevHistory,
        structuredClone(currentMatchData),
      ]);

      setCurrentMatchData((prev) => {
        const updatedMatchData = {
          ...prev,

          innings: prev.innings.map((inning, index) =>
            index === prev.innings.length - 1
              ? {
                  ...inning,
                  runs: inning.runs + numRuns,
                  legalBalls: inning.legalBalls + 1,
                }
              : inning,
          ),

          currentPlayers: {
            ...prev.currentPlayers,

            striker: {
              ...prev.currentPlayers.striker,

              Runs: prev.currentPlayers.striker.Runs + numRuns,

              Balls: prev.currentPlayers.striker.Balls + 1,

              Six:
                val === "6"
                  ? prev.currentPlayers.striker.Six + 1
                  : prev.currentPlayers.striker.Six,

              Four:
                val === "4"
                  ? prev.currentPlayers.striker.Four + 1
                  : prev.currentPlayers.striker.Four,

              StrikeRate:
                ((prev.currentPlayers.striker.Runs + numRuns) /
                  (prev.currentPlayers.striker.Balls + 1)) *
                100,
            },

            bowler: {
              ...prev.currentPlayers.bowler,

              Balls: prev.currentPlayers.bowler.Balls + 1,

              Runs: prev.currentPlayers.bowler.Runs + numRuns,

              Four:
                val === "4"
                  ? prev.currentPlayers.bowler.Four + 1
                  : prev.currentPlayers.bowler.Four,

              Six:
                val === "6"
                  ? prev.currentPlayers.bowler.Six + 1
                  : prev.currentPlayers.bowler.Six,

              wicket: prev.currentPlayers.bowler.wicket,

              Economy:
                (prev.currentPlayers.bowler.Runs + numRuns) /
                ((prev.currentPlayers.bowler.Balls + 1) / 6),
            },
          },
        };

        return updatedMatchData;
      });
      swapBatsman(val);
    } else if (val === "OUT") {
      setShowOutModal(true);
    } else if (["WD", "NB", "LB", "BYE"].includes(val)) {
      setExtraType(val);
      setIsExtraModalOpen(true);
    } else if (val === "SWAP") {
      swapBatsman(val);
    } else if (val === "MORE") {
      setOpenMoreOptionModal(true);
    } else if (val === "UNDO") {
      handleUndo();
    }
  };
  // variable to prevent open bolwer screen again when user press undo
  const isUndoRef = useRef(false);

  function handleUndo() {
    setMatchHistory((prevHistory) => {
      if (prevHistory.length === 0) {
        return prevHistory;
      }

      const previousState = prevHistory[prevHistory.length - 1];
      // Tell useEffect this change came from UNDO
      isUndoRef.current = true;
      setCurrentMatchData(previousState);

      return prevHistory.slice(0, -1);
    });
  }
  // handle add new bowler modal

  useEffect(() => {
    if (isUndoRef.current) {
      isUndoRef.current = false;
      return;
    }
    if (legalBalls > 0 && legalBalls % 6 === 0) {
      setOpenAddBowlerModal(true);
    }
  }, [legalBalls]);
  // console.log(currentMatchData);

  //  function to update new bolwer
  function updateNewBolwer(name) {
    console.log(name);
  }

  const navigate = useNavigate();

  const lastBackPress = useRef(0);

  const handleBackBtn = () => {
    const now = Date.now();

    if (now - lastBackPress.current < 1500) {
      navigate("/local-match/setup");
      return;
    }

    lastBackPress.current = now;

    toast.dark("Press back twice to leave", {
      autoClose: 1000,
      position: "bottom-right",
    });
  };

  // const ballColors = {
  //   wicket: "bg-red-500",
  //   four: "bg-orange-600",
  //   six: "bg-green-600",
  // };

  const buttonColors = {
    0: "border-3 border-green-600 text-green-600",
    1: "border-3 border-green-600 text-green-600",
    2: "border-3 border-green-600 text-green-600",
    3: "border-3 border-green-600 text-green-600",
    4: "border-3 border-green-600 text-green-600",
    6: "border-3 border-green-600 text-green-600",
    "...": "border-3 border-green-600 text-green-600",
    MORE: "border-3 border-green-600 text-green-600 text-[.8rem]",
    UNDO: "border-3 border-yellow-600 text-yellow-600 text-[.8rem]",
    SWAP: "border-3 border-yellow-600 text-yellow-600 text-[.8rem]",
    WD: "border-3 border-blue-600 text-blue-600",
    NB: "border-3 border-blue-600 text-blue-600",
    LB: "border-3 border-blue-600 text-blue-600",
    BYE: "border-3 border-blue-600 text-blue-600 text-[.8rem]",
    OUT: "border-3 border-red-600 text-red-600 text-[.8rem]",
  };

  return (
    <div className="h-dvh w-screen pt-12 flex justify-center">
      <header className="fixed top-0 left-0 z-[999] h-[var(--nav-h)] bg-base-100 flex items-center gap-2 px-2 w-dvw">
        <div className="flex items-center gap-2">
          <ArrowLeft size={30} strokeWidth={3} onClick={handleBackBtn} />
          <h4 className="font-bold">Hills Cricket Scorer</h4>
        </div>
      </header>

      {/* main scoring screen */}
      <div className="flex flex-col gap-2 w-[97%] lg:w-[60%]">
        {/* header */}
        <div className="flex justify-center gap-2 h-15 items-center">
          <h1>{currentMatchData.firstTeam.name}</h1>
          <span>Vs</span>
          <h2>{currentMatchData.secondTeam.name}</h2>
        </div>

        {/* score display */}
        <div className="flex border border-base-content/15 rounded-md">
          {/* score */}
          <div className="flex-2 p-2">
            {/* Team name and inning */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <p>kandaghat</p>
                <p>1st Inning</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-4xl font-semibold">
                  {totalRuns}-{wicketsOut}
                </div>
                <div className="text-lg">
                  ({Math.floor(legalBalls / 6)}.{legalBalls % 6})
                </div>
              </div>
            </div>
          </div>

          {/* runrate */}
          <div className="flex-1 p-2 text-sm flex flex-col items-end">
            <p className="font-semibold">CRR</p>
            <p className="">
              {currentRunRate > 0 ? currentRunRate.toFixed(1) : "0.0"}
            </p>
          </div>
        </div>

        {/* current score board list */}
        <div className="border border-base-content/15 rounded-md">
          <table className="w-full table-fixed text-[.85rem]">
            <thead className="">
              <tr className="">
                <th className="text-left px-3 py-2">Batsman</th>
                <th className="px-3 py-2">R</th>
                <th className="px-3 py-2">B</th>
                <th className="px-3 py-2">4s</th>
                <th className="px-3 py-2">6s</th>
                <th className="px-3 py-2">SR</th>
              </tr>
            </thead>

            <tbody className="border-b border-base-content/15">
              <tr className="text-blue-500">
                <td className="text-left px-3 py-2">
                  {currentMatchData.currentPlayers.striker.name}*
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.striker.Runs}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.striker.Balls}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.striker.Four}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.striker.Six}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.striker.StrikeRate.toFixed(
                    1,
                  )}
                </td>
              </tr>

              <tr className="">
                <td className="text-left px-3 py-2">
                  {currentMatchData.currentPlayers.nonStriker.name}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.nonStriker.Runs}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.nonStriker.Balls}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.nonStriker.Four}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.nonStriker.Six}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.nonStriker.StrikeRate.toFixed(
                    1,
                  )}
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th className="text-left px-3 py-2">Bowler</th>
                <th className="px-3 py-2">O</th>
                <th className="px-3 py-2">M</th>
                <th className="px-3 py-2">R</th>
                <th className="px-3 py-2">W</th>
                <th className="px-3 py-2">ECO</th>
              </tr>
            </thead>
            <tbody className="">
              <tr className="">
                <td className="text-left px-3 py-2">
                  {currentMatchData.currentPlayers.bowler.name}
                </td>
                <td className="text-center px-3 py-2">
                  {Math.floor(matchData.currentPlayers.bowler.Balls / 6)}.
                  {currentMatchData.currentPlayers.bowler.Balls % 6}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.bowler.Maidens}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.bowler.Runs}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.bowler.wicket}
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData.currentPlayers.bowler.Economy.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* per ball record */}
        <div className="border border-base-content/15 rounded-md flex items-center text-[.85rem] pl-2 gap-2 py-2">
          <p className="shrink-0 whitespace-nowrap">This over :</p>

          <div className="flex gap-2 overflow-x-auto min-w-0 hide-scrollbar">
            {/* {Array.from({ length: 6 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="bg-orange-500 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                >
                  6
                </div>
              );
            })} */}
          </div>
        </div>

        {/* socring button and extra button */}
        <div className=" flex border-base-content/15 rounded-md gap-2">
          {/* scoring button */}
          <div className="flex-2 border border-base-content/15 py-4 px-2 rounded-md grid gap-y-4 grid-cols-5 place-items-center">
            {scoringButton.map((btn) => {
              return (
                <button
                  onClick={() => handleScoreBtnClick(btn)}
                  className={`border-base-content/40 w-15 h-15 rounded-full font-semibold ${buttonColors[btn]} cursor-pointer border-2`}
                  key={btn}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isExtraModalOpen && (
        <ExtraRunCountModal
          extraType={extraType}
          onClose={() => setIsExtraModalOpen(false)}
          onConfirm={onConfirm}
          showOutModal={showOutModal}
          setShowOutModal={setShowOutModal}
        />
      )}

      {showOutModal && <OutModal onClose={() => setShowOutModal(false)} />}

      {openMoreMotionModal && (
        <MoreOptionScoringModal onClose={() => setOpenMoreOptionModal(false)} />
      )}
      {openAddBowlerModal && (
        <AddNewBowlerModal
          onClose={() => {
            setOpenAddBowlerModal(false);
          }}
          updateNewbowler={updateNewBolwer}
        />
      )}
    </div>
  );
};
