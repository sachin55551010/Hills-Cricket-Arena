import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
const formatOvers = (legalBalls = 0) =>
  `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

const getTeamNameById = (match, teamId) => {
  if (match?.firstTeam?.teamId === teamId) return match.firstTeam?.name ?? "";
  if (match?.secondTeam?.teamId === teamId) return match.secondTeam?.name ?? "";
  return "";
};

// Mirrors the per-ball styling used on the scoring page
const getBallStyle = (ball) => {
  if (ball.type === "WICKET")
    return {
      bg: "bg-red-500",
      text: "text-white",
      label: "W",
    };

  if (ball.type === "WD")
    return {
      bg: "bg-yellow-500",
      text: "text-black",
      label: "WD",
      runs: Math.max((ball.totalRuns ?? 1) - 1, 0),
    };

  if (ball.type === "NB")
    return {
      bg: "bg-yellow-500",
      text: "text-black",
      label: "NB",
      runs: Math.max((ball.totalRuns ?? 1) - 1, 0),
    };

  if (ball.type === "LB")
    return {
      bg: "bg-purple-500",
      text: "text-white",
      label: "LB",
      runs: ball.runs ?? 0,
    };

  if (ball.type === "BYE")
    return {
      bg: "bg-purple-500",
      text: "text-white",
      label: "B",
      runs: ball.runs ?? 0,
    };

  if (ball.runs === 6)
    return {
      bg: "bg-green-500",
      text: "text-white",
      label: "6",
    };

  if (ball.runs === 4)
    return {
      bg: "bg-green-500",
      text: "text-white",
      label: "4",
    };

  if (ball.runs === 0)
    return {
      bg: "bg-gray-500",
      text: "text-white",
      label: "0",
    };

  return {
    bg: "bg-blue-500",
    text: "text-white",
    label: String(ball.runs),
  };
};

// Human-readable description of what happened on a delivery
const describeBall = (ball) => {
  switch (ball.type) {
    case "WICKET":
      return "Wicket";
    case "WD":
      return `Wide (${ball.totalRuns} run${ball.totalRuns !== 1 ? "s" : ""})`;
    case "NB":
      return `No ball (${ball.totalRuns} run${ball.totalRuns !== 1 ? "s" : ""})`;
    case "LB":
      return `Leg bye (${ball.runs})`;
    case "BYE":
      return `Bye (${ball.runs})`;
    default:
      if (ball.runs === 4) return "Four";
      if (ball.runs === 6) return "Six";
      if (ball.runs === 0) return "Dot ball";
      return `${ball.runs} run${ball.runs !== 1 ? "s" : ""}`;
  }
};

const OverCard = ({ over, isCurrent }) => {
  const balls = over.balls || [];
  const wickets = over.wickets || 0;
  const legalBalls = over.legalBalls || 0;

  return (
    <div className="overflow-hidden rounded-xl border border-base-content/15">
      {/* Over header */}
      <div
        className={`flex items-center justify-between px-3 py-2 ${
          isCurrent ? "bg-blue-500/10" : "bg-base-content/5"
        }`}
      >
        <div className="min-w-0">
          <p className="text-sm font-bold">
            Over {over.over}
            {isCurrent && (
              <span className="ml-2 text-[10px] font-semibold text-blue-500">
                CURRENT
              </span>
            )}
          </p>
          <p className="truncate text-xs text-base-content/60">
            {over.bowlerName || "Bowler"}
            <span className="text-base-content/40"> · {legalBalls} balls</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold leading-none">{over.runs ?? 0}</p>
          <p className="text-[11px] text-base-content/60">
            {wickets > 0 ? `${wickets} wk` : "0 wk"}
          </p>
        </div>
      </div>

      {/* Ball-by-ball strip */}
      <div className="flex flex-wrap gap-2 px-3 py-3">
        {balls.length > 0 ? (
          balls.map((ball, index) => {
            const style = getBallStyle(ball);

            const isExtra = ["WD", "NB", "LB", "BYE"].includes(ball.type);

            return (
              <div
                key={ball.timestamp || index}
                title={`${ball.batsmanName || "Batsman"} · ${describeBall(ball)}`}
                className="flex flex-col items-center"
              >
                {/* Ball circle */}
                <div
                  className={`
              ${style.bg}
              ${style.text}
              flex h-8 min-w-8 items-center justify-center
              rounded-full px-1.5
              text-xs font-bold
              shadow-sm
            `}
                >
                  {style.label}
                </div>

                {/* Only show runs for extra deliveries */}
                {isExtra && (
                  <span className="mt-1 text-[10px] font-semibold leading-none text-base-content/60">
                    {style.runs}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs italic text-base-content/40">No balls yet</p>
        )}
      </div>
    </div>
  );
};

const InningOvers = ({ match, inning, isCurrent }) => {
  const [isOpen, setIsOpen] = useState(isCurrent);

  if (!inning) return null;

  const overHistory = inning.overHistory || [];

  const battingTeamName =
    inning.battingTeam ||
    getTeamNameById(match, inning.battingTeamId) ||
    "Team";

  const bowlingTeamName =
    inning.bowlingTeam ||
    getTeamNameById(match, inning.bowlingTeamId) ||
    "Team";

  const totalOverRuns = overHistory.reduce(
    (sum, over) => sum + (over.runs || 0),
    0,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-base-content/15 bg-base-100">
      {/*  HEADER  */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
          isOpen ? "bg-base-content/5" : "hover:bg-base-content/5"
        }`}
      >
        {/* Left side */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold">{battingTeamName}</h3>

            {isCurrent && (
              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
                LIVE
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-base-content/50">
            {inning.inning === 1 ? "1st Inning" : "2nd Inning"}
            <span className="mx-1">·</span>
            vs {bowlingTeamName}
          </p>
        </div>

        {/* Score + Chevron */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className="text-xl font-bold leading-none">
              {inning.runs ?? 0}-{inning.wickets ?? 0}
            </p>

            <p className="mt-1 text-[11px] text-base-content/60">
              ({formatOvers(inning.legalBalls || 0)} ov)
            </p>
          </div>

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className={`text-base-content/50 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/*  ACCORDION CONTENT  */}
      <div
        className={`grid transition-[grid-template-rows]  ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-base-content/10 p-3">
            {overHistory.length > 0 ? (
              <>
                {/* Overs */}
                <div className="flex flex-col gap-3">
                  {[...overHistory]
                    .map((over, index) => ({
                      over,
                      isOverCurrent:
                        isCurrent && index === overHistory.length - 1,
                    }))
                    .reverse()
                    .map(({ over, isOverCurrent }) => (
                      <OverCard
                        key={over.over}
                        over={over}
                        isCurrent={isOverCurrent}
                      />
                    ))}
                </div>

                {/* Total */}
                <div className="mt-3 flex items-center justify-between rounded-xl border border-base-content/15 bg-base-content/5 px-3 py-2 text-sm">
                  <span className="font-semibold">Total from overs</span>

                  <span className="font-bold">
                    {totalOverRuns} run
                    {totalOverRuns !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            ) : (
              <p className="py-6 text-center text-sm italic text-base-content/40">
                No overs bowled yet
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const LocalMatchOvers = ({ matchData = null, showBackLink = true }) => {
  const { currentMatchData: liveMatchData } = useSelector(
    (state) => state.score,
  );
  const currentMatchData = matchData || liveMatchData;

  const innings = currentMatchData?.innings || [];
  const currentInningNumber = Number(currentMatchData?.currentInning) || 1;

  if (!currentMatchData || innings.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-base-content/50">
        No match data available.
      </div>
    );
  }

  return (
    <div className={`w-full px-3 pb-10 ${showBackLink ? "pt-34" : "pt-4"}`}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {currentMatchData.matchStatus === "completed" &&
          currentMatchData.matchResult && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary">
              {currentMatchData.matchResult}
            </div>
          )}

        {[...innings]
          .map((inning, index) => ({
            inning,
            isCurrent: index + 1 === currentInningNumber,
          }))
          .reverse()
          .map(({ inning, isCurrent }, index) => (
            <InningOvers
              key={inning.inning || index}
              match={currentMatchData}
              inning={inning}
              isCurrent={isCurrent}
            />
          ))}

        {showBackLink && (
          <Link
            to=".."
            relative="path"
            className="btn btn-sm btn-outline self-center rounded-lg"
          >
            Back to scoring
          </Link>
        )}
      </div>
    </div>
  );
};
