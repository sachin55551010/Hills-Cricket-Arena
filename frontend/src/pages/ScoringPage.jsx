import { useEffect, useState } from "react";
import { ExtraRunCountModal } from "../components/modals/ExtraRunCountModal";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OutModal } from "../components/modals/OutModal";
import { MoreOptionScoringModal } from "../components/modals/MoreOptionScoringModal";
import { AddNewBowlerModal } from "../components/modals/AddNewBowlerModal";

import { useDispatch, useSelector } from "react-redux";
import { addRuns } from "../store/scoreSlice";
export const ScoringPage = () => {
  const { currentMatchData } = useSelector((state) => state.score);

  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [extraType, setExtraType] = useState("");
  const [showNormalOutModal, setShowNormalOutModal] = useState(false);
  const [showExtraOutModal, setShowExtraOutModal] = useState(false);
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

  // console.log("currentMatchData", currentMatchData);

  const dispatch = useDispatch();
  const currentInningNumber = Number(currentMatchData?.currentInning);

  const currentInning = currentMatchData?.innings?.[currentInningNumber - 1];

  const teamScore = currentInning?.runs;
  const legalBalls = currentInning?.legalBalls;
  const fallOfwickets = currentInning?.wickets;
  const currentRunRate = ((teamScore * 6) / legalBalls).toFixed(1);
  const bowlerEconomy =
    currentMatchData?.currentPlayers?.bowler?.bowlingStats?.economy;

  const strikerBatsmanStrikeRate =
    currentMatchData?.currentPlayers?.striker?.battingStats?.strikeRate;
  const nonStrikerBatsmanStrikeRate =
    currentMatchData?.currentPlayers?.nonStriker?.battingStats?.strikeRate;
  const battingTeamName =
    currentMatchData?.innings[currentInningNumber - 1].battingTeam;

  const onConfirm = (data) => {
    console.log("Data", data);
    dispatch(addRuns(data));
  };

  const handleScoreBtnClick = (val) => {
    // Extra
    if (["WD", "NB", "LB", "BYE"].includes(val)) {
      setExtraType(val);
      setIsExtraModalOpen(true);
      return;
    }

    // Normal wicket
    if (val === "OUT") {
      setShowNormalOutModal(true);
      return;
    }

    // More
    if (val === "MORE") {
      setOpenMoreOptionModal(true);
      return;
    }

    // Normal runs
    dispatch(addRuns(val));
  };
  // console.log(currentMatchData);

  useEffect(() => {
    if (legalBalls > 0 && legalBalls % 6 === 0) {
      setOpenAddBowlerModal(true);
      return;
    }
  }, [legalBalls]);

  function updateNewBolwer(name) {
    console.log(name);
  }

  const navigate = useNavigate();

  const handleBackBtn = () => {
    navigate("/local-match/setup");
    return;
  };

  // console.log(currentMatchData);

  // const ballColors = {
  //   wicket: "bg-red-500",
  //   four: "bg-orange-600",
  //   six: "bg-green-600",
  // };

  // console.log(currentMatchData);

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
          <h1 className="font-bold">{currentMatchData?.firstTeam?.name}</h1>
          <span className="font-semibold text-base-content/70">Vs</span>
          <h2 className="font-bold">{currentMatchData?.secondTeam?.name}</h2>
        </div>

        {/* score display */}
        <div className="flex border border-base-content/15 rounded-md">
          {/* score */}
          <div className="flex-2 p-2">
            {/* Team name and inning */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <p>{battingTeamName}</p>
                <p>1st Inning</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-4xl font-semibold">
                  {teamScore}-{fallOfwickets}
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
            <p className="">{legalBalls > 0 ? currentRunRate : "0.0"}</p>
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
                  {currentMatchData?.currentPlayers?.striker?.name}*
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData?.currentPlayers?.striker.battingStats?.runs}
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.striker?.battingStats
                      ?.balls
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.striker?.battingStats
                      ?.fours
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.striker?.battingStats
                      ?.sixes
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {strikerBatsmanStrikeRate?.toFixed(1)}
                </td>
              </tr>

              <tr className="">
                <td className="text-left px-3 py-2">
                  {currentMatchData?.currentPlayers?.nonStriker?.name}
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.nonStriker?.battingStats
                      ?.runs
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.nonStriker?.battingStats
                      .balls
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.nonStriker?.battingStats
                      .fours
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.nonStriker?.battingStats
                      .sixes
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {nonStrikerBatsmanStrikeRate?.toFixed(1)}
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
                  {currentMatchData?.currentPlayers?.bowler?.name}
                </td>
                <td className="text-center px-3 py-2">
                  {Math.floor(
                    currentMatchData?.currentPlayers?.bowler?.bowlingStats
                      ?.balls / 6,
                  )}
                  .
                  {currentMatchData?.currentPlayers?.bowler?.bowlingStats
                    ?.balls % 6}
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.bowler?.bowlingStats
                      ?.maidens
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {currentMatchData?.currentPlayers?.bowler?.bowlingStats?.runs}
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.bowler?.bowlingStats
                      ?.wickets
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {bowlerEconomy?.toFixed(1)}
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
          <div
            className={`flex-2 border border-base-content/15 py-4 px-2 rounded-md grid gap-y-4 grid-cols-5 place-items-center`}
          >
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

      {/* EXTRA RUN MODAL */}
      {isExtraModalOpen && (
        <ExtraRunCountModal
          extraType={extraType}
          onClose={() => setIsExtraModalOpen(false)}
          onConfirm={onConfirm}
          showOutModal={showExtraOutModal}
          setShowOutModal={setShowExtraOutModal}
        />
      )}

      {/* NORMAL WICKET MODAL */}
      {showNormalOutModal && (
        <OutModal
          pendingData={null}
          onClose={() => setShowNormalOutModal(false)}
          onSubmit={(outData) => {
            console.log("NORMAL WICKET:", outData);

            onConfirm(outData);

            setShowNormalOutModal(false);
          }}
        />
      )}

      {openMoreMotionModal && (
        <MoreOptionScoringModal onClose={() => setOpenMoreOptionModal(false)} />
      )}
      {openAddBowlerModal && (
        <AddNewBowlerModal
          onClose={() => {
            setOpenAddBowlerModal(false);
            dispatch(addRuns("UNDO"));
          }}
          updateNewbowler={updateNewBolwer}
        />
      )}
    </div>
  );
};
