import { useEffect, useState } from "react";
import { ExtraRunCountModal } from "../components/modals/ExtraRunCountModal";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { OutModal } from "../components/modals/OutModal";
import { MoreOptionScoringModal } from "../components/modals/MoreOptionScoringModal";
import { AddNewBowlerModal } from "../components/modals/AddNewBowlerModal";
import { StartSecondInningModal } from "../components/modals/StartSecondInningModal";
import { useDispatch, useSelector } from "react-redux";
import { recordDelivery } from "../store/scoreSlice";
import { persistScoreState } from "../store/persistMatch";
import { GrScorecard } from "react-icons/gr";
export const ScoringPage = () => {
  const scoreState = useSelector((state) => state.score);
  const { currentMatchData } = scoreState;
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [extraType, setExtraType] = useState("");
  const [showNormalOutModal, setShowNormalOutModal] = useState(false);
  const [showExtraOutModal, setShowExtraOutModal] = useState(false);
  const [openAddBowlerModal, setOpenAddBowlerModal] = useState(false);
  const [openMoreMotionModal, setOpenMoreOptionModal] = useState(false);
  const [showStartSecondInningModal, setShowStartSecondInningModal] =
    useState(false);

  // scoring buttons
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentInningNumber = Number(currentMatchData?.currentInning);
  const currentInning = currentMatchData?.innings?.[currentInningNumber - 1];
  const inning1 = currentMatchData?.innings?.[0];

  const teamScore = currentInning?.runs ?? 0;
  const legalBalls = currentInning?.legalBalls ?? 0;
  const fallOfWickets = currentInning?.wickets ?? 0;
  const totalOvers =
    currentMatchData?.totalOvers ?? currentMatchData?.overs ?? 0;
  const battingSquadSize =
    currentInning?.battingTeamId === currentMatchData?.firstTeam?.teamId
      ? (currentMatchData?.firstTeamTotalPlayer ??
        currentMatchData?.firstTeam?.players?.length ??
        11)
      : (currentMatchData?.secondTeamTotalPlayer ??
        currentMatchData?.secondTeam?.players?.length ??
        11);
  const maxWickets = Math.max(Number(battingSquadSize) - 1, 1);

  const currentRunRate =
    legalBalls > 0 ? ((teamScore * 6) / legalBalls).toFixed(1) : "0.0";
  const bowlerEconomy =
    currentMatchData?.currentPlayers?.bowler?.bowlingStats?.economy;
  const strikerSR =
    currentMatchData?.currentPlayers?.striker?.battingStats?.strikeRate;
  const nonStrikerSR =
    currentMatchData?.currentPlayers?.nonStriker?.battingStats?.strikeRate;

  const battingTeamName = currentInning?.battingTeam ?? "";

  // Target / required run rate (inning 2 only)
  const isSecondInning = currentInningNumber === 2;
  const target = currentMatchData?.target;
  const runsRequired =
    isSecondInning && target != null ? Math.max(target - teamScore, 0) : null;
  const ballsLeft = isSecondInning
    ? Math.max(totalOvers * 6 - legalBalls, 0)
    : null;
  const requiredRunRate =
    isSecondInning && ballsLeft > 0
      ? ((runsRequired * 6) / ballsLeft).toFixed(1)
      : null;

  // Match completed
  const isMatchCompleted = currentMatchData?.matchStatus === "completed";
  const matchResult = currentMatchData?.matchResult ?? "";

  // Over ball data
  const overHistory = currentInning?.overHistory || [];
  const currentOverData =
    overHistory.length > 0 ? overHistory[overHistory.length - 1] : null;
  const currentOverBalls = currentOverData?.balls || [];

  // Inning label
  const inningLabel = currentInningNumber === 1 ? "1st Inning" : "2nd Inning";

  // Ball display helper
  const getBallStyle = (ball) => {
    if (ball.type === "WICKET")
      return { bg: "bg-red-500", text: "text-white", label: "W" };
    if (ball.type === "WD")
      return {
        bg: "bg-yellow-500",
        text: "text-black",
        label: `${ball.totalRuns}WD`,
      };
    if (ball.type === "NB")
      return {
        bg: "bg-yellow-500",
        text: "text-black",
        label: `${ball.totalRuns}NB`,
      };
    if (ball.type === "LB")
      return {
        bg: "bg-purple-500",
        text: "text-white",
        label: `${ball.runs}LB`,
      };
    if (ball.type === "BYE")
      return {
        bg: "bg-purple-500",
        text: "text-white",
        label: `${ball.runs}B`,
      };
    if (ball.runs === 6)
      return { bg: "bg-green-500", text: "text-white", label: "6" };
    if (ball.runs === 4)
      return { bg: "bg-green-500", text: "text-white", label: "4" };
    if (ball.runs === 0)
      return { bg: "bg-gray-500", text: "text-white", label: "0" };
    return { bg: "bg-blue-500", text: "text-white", label: String(ball.runs) };
  };

  const onConfirm = (data) => dispatch(recordDelivery(data));

  // button to perform all socirng related task
  const handleScoreBtnClick = (val) => {
    if (isMatchCompleted) return; // block scoring after match ends
    if (["WD", "NB", "LB", "BYE"].includes(val)) {
      setExtraType(val);
      setIsExtraModalOpen(true);
      return;
    }
    if (val === "OUT") {
      setShowNormalOutModal(true);
      return;
    }
    if (val === "MORE") {
      setOpenMoreOptionModal(true);
      return;
    }
    dispatch(recordDelivery(val));
  };

  // Detect inning 1 end: all overs completed OR all wickets fallen
  useEffect(() => {
    if (
      currentInningNumber !== 1 ||
      isMatchCompleted ||
      showStartSecondInningModal
    )
      return;

    const allOversCompleted = totalOvers > 0 && legalBalls >= totalOvers * 6;
    const allOut = fallOfWickets >= maxWickets;

    if (allOversCompleted || allOut) {
      setShowStartSecondInningModal(true);
    }
  }, [
    legalBalls,
    fallOfWickets,
    currentInningNumber,
    isMatchCompleted,
    showStartSecondInningModal,
    totalOvers,
    maxWickets,
  ]);

  // Detect mid-inning over change (new bowler needed after each 6-ball over)
  useEffect(() => {
    if (legalBalls <= 0 || legalBalls % 6 !== 0) return;
    if (isMatchCompleted || showStartSecondInningModal) return;

    // Inning 1: over change (not the last over — that's handled above)
    if (currentInningNumber === 1) {
      const allOversCompleted = totalOvers > 0 && legalBalls >= totalOvers * 6;
      if (!allOversCompleted) {
        setOpenAddBowlerModal(true);
      }
      return;
    }

    // Inning 2: show new bowler unless match is over or final over done
    if (currentInningNumber === 2) {
      const finalOverDone = totalOvers > 0 && legalBalls >= totalOvers * 6;
      if (!finalOverDone) {
        setOpenAddBowlerModal(true);
      }
    }
  }, [
    currentInningNumber,
    isMatchCompleted,
    legalBalls,
    showStartSecondInningModal,
    totalOvers,
  ]);

  const handleBackBtn = () => {
    persistScoreState(scoreState);
    navigate("/local-match/setup");
  };

  // each ball colors
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

      {/* Match Completed Overlay */}
      {isMatchCompleted && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full">
            <Trophy size={56} className="mx-auto mb-3 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Match Completed!</h2>
            <p className="text-lg font-semibold text-primary mb-1">
              {matchResult}
            </p>
            {inning1 && (
              <div className="mt-3 text-sm text-base-content/60 space-y-1">
                <p>
                  {inning1.battingTeam}: {inning1.runs}/{inning1.wickets} (
                  {totalOvers} ov)
                </p>
                {currentInning && currentInningNumber === 2 && (
                  <p>
                    {currentInning.battingTeam}: {currentInning.runs}/
                    {currentInning.wickets} ({Math.floor(legalBalls / 6)}.
                    {legalBalls % 6} ov)
                  </p>
                )}
              </div>
            )}
            <button
              onClick={handleBackBtn}
              className="btn btn-primary mt-6 w-full rounded-xl"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* main scoring screen */}
      <div className="flex flex-col gap-2 w-[97%] lg:w-[60%]">
        {/* header */}
        <div className="flex gap-2 h-15 items-center relative">
          <h1 className="font-bold">{currentMatchData?.firstTeam?.name}</h1>
          <span className="font-semibold text-base-content/70">Vs</span>
          <h2 className="font-bold">{currentMatchData?.secondTeam?.name}</h2>
          <Link
            to="scoreboard"
            className="border p-2 absolute right-0 rounded-md border-base-content/30 cursor-pointer"
          >
            <GrScorecard />
          </Link>
        </div>

        {/* Target banner for inning 2 */}
        {isSecondInning && target != null && !isMatchCompleted && (
          <div className="rounded-xl bg-warning/15 border border-warning/30 px-4 py-2 text-center text-sm">
            <span className="font-semibold text-warning">Target: {target}</span>
            <span className="ml-2 text-base-content/70">
              Need {runsRequired} off {ballsLeft} balls
              {requiredRunRate && ` · RRR ${requiredRunRate}`}
            </span>
          </div>
        )}

        {/* score display */}
        <div className="flex border border-base-content/15 rounded-md">
          {/* score */}
          <div className="flex-2 p-2">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <p>{battingTeamName}</p>
                <p>{inningLabel}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-4xl font-semibold">
                  {teamScore}-{fallOfWickets}
                </div>
                <div className="text-lg">
                  ({Math.floor(legalBalls / 6)}.{legalBalls % 6})
                </div>
              </div>

              {/* 1st inning score shown in 2nd inning */}
              {isSecondInning && inning1 && (
                <p className="text-xs text-base-content/50">
                  {inning1.battingTeam}: {inning1.runs}/{inning1.wickets} (
                  {totalOvers} ov)
                </p>
              )}
            </div>
          </div>

          {/* runrate */}
          <div className="flex-1 p-2 text-sm flex flex-col items-end gap-1">
            <div>
              <p className="font-semibold">CRR</p>
              <p>{currentRunRate}</p>
            </div>
            {isSecondInning && requiredRunRate && (
              <div className="text-right">
                <p className="font-semibold text-warning">RRR</p>
                <p className="text-warning">{requiredRunRate}</p>
              </div>
            )}
          </div>
        </div>

        {/* current score board list */}
        <div className="border border-base-content/15 rounded-md">
          <table className="w-full table-fixed text-[.85rem]">
            <thead>
              <tr>
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
                  {
                    currentMatchData?.currentPlayers?.striker?.battingStats
                      ?.runs
                  }
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
                  {strikerSR?.toFixed(1)}
                </td>
              </tr>
              <tr>
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
                      ?.balls
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.nonStriker?.battingStats
                      ?.fours
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {
                    currentMatchData?.currentPlayers?.nonStriker?.battingStats
                      ?.sixes
                  }
                </td>
                <td className="text-center px-3 py-2">
                  {nonStrikerSR?.toFixed(1)}
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
            <tbody>
              <tr>
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
          <p className="shrink-0 whitespace-nowrap font-semibold">
            This over :
          </p>
          <div className="flex gap-2 overflow-x-auto min-w-0 hide-scrollbar">
            {currentOverBalls.length > 0 ? (
              currentOverBalls.map((ball, index) => {
                const style = getBallStyle(ball);
                return (
                  <div
                    key={index}
                    className={`${style.bg} ${style.text} min-w-7 h-7 px-1 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm`}
                  >
                    {style.label}
                  </div>
                );
              })
            ) : (
              <p className="text-base-content/40 italic">No balls yet</p>
            )}
          </div>
        </div>

        {/* scoring buttons */}
        <div className="flex border-base-content/15 rounded-md gap-2">
          <div
            className={`flex-2 border border-base-content/15 py-4 px-2 rounded-md grid gap-y-4 grid-cols-5 place-items-center ${isMatchCompleted ? "opacity-40 pointer-events-none" : ""}`}
          >
            {scoringButton.map((btn) => (
              <button
                onClick={() => handleScoreBtnClick(btn)}
                className={`border-base-content/40 w-15 h-15 rounded-full font-semibold ${buttonColors[btn]} cursor-pointer border-2`}
                key={btn}
              >
                {btn}
              </button>
            ))}
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
            onConfirm(outData);
            setShowNormalOutModal(false);
          }}
        />
      )}

      {openMoreMotionModal && (
        <MoreOptionScoringModal onClose={() => setOpenMoreOptionModal(false)} />
      )}

      {/* NEW BOWLER (mid-match over change) */}
      {openAddBowlerModal && (
        <AddNewBowlerModal onClose={() => setOpenAddBowlerModal(false)} />
      )}

      {/* START 2ND INNING */}
      {showStartSecondInningModal && (
        <StartSecondInningModal
          onClose={() => setShowStartSecondInningModal(false)}
          onUndo={() => {
            dispatch(recordDelivery("UNDO"));
            setShowStartSecondInningModal(false);
          }}
        />
      )}
    </div>
  );
};
