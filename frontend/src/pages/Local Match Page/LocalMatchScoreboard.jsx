import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronDown, Pencil } from "lucide-react";
import { RenamePlayerModal } from "../../components/modals/RenamePlayerModal";

const formatOvers = (legalBalls = 0) =>
  `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

const getTeamNameById = (match, teamId) => {
  if (match?.firstTeam?.teamId === teamId) return match.firstTeam?.name ?? "";
  if (match?.secondTeam?.teamId === teamId) return match.secondTeam?.name ?? "";
  return "";
};

const getPlayerId = (player) => player?.id ?? player?.playerId ?? "";

const economyOf = (stats) => {
  if (!stats || !stats.balls) return null;
  return (stats.runs / stats.balls) * 6;
};

const emptyExtras = {
  wideBallRun: 0,
  noBallRun: 0,
  byes: 0,
  legByes: 0,
  overthrow: 0,
};

const dismissalText = (player) => {
  if (player?.dismissal) return player.dismissal;
  if (!player) return "out";
  if (player.wicketType === "Run Out") {
    return `run out (${player.fielder?.name || "fielder"})`;
  }
  if (player.wicketType === "Caught") {
    return `c ${player.fielder?.name || ""} b ${player.bowlerName || ""}`;
  }
  if (player.wicketType === "Stumped") {
    return `st ${player.fielder?.name || ""} b ${player.bowlerName || ""}`;
  }
  if (player.wicketType === "Retired Out") return "retired out";
  if (player.wicketType) {
    return `${player.wicketType.toLowerCase()} b ${player.bowlerName || ""}`;
  }
  return "out";
};

/*
 * Full batting card:
 * - Completed innings use the saved battingCard snapshot.
 * - The live innings is built from dismissed players plus the not-out pair.
 */
const getBattingCard = (inning, currentPlayers, isCurrent) => {
  if (inning.battingCard?.length) {
    return inning.battingCard;
  }

  const card = [];
  const seen = new Set();

  const push = (player, isNotOut) => {
    if (!player) return;
    const id = getPlayerId(player);
    if (id && seen.has(id)) return;
    if (id) seen.add(id);
    card.push({
      playerId: id,
      name: player.name || "",
      battingStats: { ...(player.battingStats || {}) },
      isNotOut,
      dismissal: isNotOut ? "not out" : dismissalText(player),
    });
  };

  (inning.outPlayers || []).forEach((player) => push(player, false));

  if (isCurrent) {
    push(currentPlayers?.striker, true);
    push(currentPlayers?.nonStriker, true);
  }

  return card;
};

const getBowlingCard = (inning, currentPlayers, isCurrent) => {
  if (inning.bowlingCard?.length) {
    return inning.bowlingCard;
  }

  const map = new Map();

  (inning.overHistory || []).forEach((over) => {
    const key = over.bowlerId || over.bowlerName;
    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: over.bowlerName || "",
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
      });
    }

    const entry = map.get(key);
    entry.balls += over.legalBalls || 0;
    entry.runs += over.runs || 0;
    entry.wickets += over.wickets || 0;

    if ((over.legalBalls || 0) >= 6 && (over.runs || 0) === 0) {
      entry.maidens += 1;
    }
  });

  const bowlers = [...map.values()];
  const currentBowlerId = isCurrent ? getPlayerId(currentPlayers?.bowler) : "";
  return bowlers.map((bowler) => ({
    ...bowler,
    isCurrent: bowler.id === currentBowlerId,
  }));
};

const AccordionSection = ({ title, subtitle, defaultOpen, children }) => {
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));

  return (
    <div className="overflow-hidden rounded-xl border border-base-content/15 bg-base-100">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-base-200/60"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-base-content/50">{subtitle}</p>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-base-content/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-base-content/10 p-3">{children}</div>
      )}
    </div>
  );
};

const InningSection = ({
  match,
  inning,
  isCurrent,
  currentPlayers,
  onEditPlayer,
}) => {
  if (!inning) return null;

  const extras = { ...emptyExtras, ...(inning.extras || {}) };
  const extrasTotal =
    (extras.wideBallRun || 0) +
    (extras.noBallRun || 0) +
    (extras.byes || 0) +
    (extras.legByes || 0) +
    (extras.overthrow || 0);

  const battingTeamName =
    inning.battingTeam ||
    getTeamNameById(match, inning.battingTeamId) ||
    "Team";

  const battingCard = getBattingCard(inning, currentPlayers, isCurrent);
  const bowlers = getBowlingCard(inning, currentPlayers, isCurrent);

  const striker = isCurrent ? currentPlayers?.striker : null;
  const nonStriker = isCurrent ? currentPlayers?.nonStriker : null;

  // Fall of wickets: 1st out player aligns with 1st wicket of the inning
  const outPlayers = inning.outPlayers || [];
  const fallOfWickets = outPlayers.map((player, index) => ({
    wicket: player.teamWickets ?? index + 1,
    name: player.name,
    runs: player.teamRuns ?? player.battingStats?.runs ?? 0,
    balls: player.battingStats?.balls ?? 0,
    over:
      player.teamLegalBalls != null ? formatOvers(player.teamLegalBalls) : null,
  }));

  const totalBalls = inning.legalBalls || 0;
  const runRate =
    totalBalls > 0 ? ((inning.runs * 6) / totalBalls).toFixed(2) : "0.00";

  const isInningComplete = Boolean(inning.battingCard);

  return (
    <section className="mt-6 flex flex-col gap-3">
      {/* Inning header */}
      <div className="border-b border-base-content/15 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold">{battingTeamName}</h3>
          <span className="rounded-md bg-base-content/10 px-2 py-0.5 text-[11px] text-base-content/70">
            {inning.inning === 1 ? "1st Inning" : "2nd Inning"}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
              isInningComplete
                ? "bg-success/15 text-success"
                : "bg-warning/15 text-warning"
            }`}
          >
            {isInningComplete ? "Completed" : "In progress"}
          </span>
        </div>

        <div className="mt-1 flex items-end justify-between">
          <p className="text-xs text-base-content/50">
            vs{" "}
            {inning.bowlingTeam || getTeamNameById(match, inning.bowlingTeamId)}
          </p>
          <div className="text-right">
            <p className="text-2xl font-bold leading-none">
              {inning.runs ?? 0}-{inning.wickets ?? 0}
            </p>
            <p className="text-xs text-base-content/60">
              ({formatOvers(totalBalls)} ov) · CRR {runRate}
            </p>
          </div>
        </div>
      </div>

      {/* Batting */}
      <AccordionSection
        title="Batting"
        subtitle={`${battingCard.length} batsman${battingCard.length === 1 ? "" : "s"}`}
        defaultOpen
      >
        <div className="overflow-hidden rounded-md border border-base-content/15">
          <table className="w-full table-fixed text-[.8rem]">
            <thead className="bg-base-content/5 text-base-content/70">
              <tr>
                <th className="w-auto px-3 py-2 text-left">Batsman</th>
                <th className="w-9 px-1 py-2">R</th>
                <th className="w-9 px-1 py-2">B</th>
                <th className="w-9 px-1 py-2">4s</th>
                <th className="w-9 px-1 py-2">6s</th>
                <th className="w-14 px-1 py-2">SR</th>
              </tr>
            </thead>
            <tbody>
              {battingCard.length > 0 ? (
                battingCard.map((player, index) => {
                  const stats = player.battingStats || {};
                  const sr =
                    stats.strikeRate != null
                      ? stats.strikeRate.toFixed(1)
                      : "0.0";
                  const isStriker =
                    isCurrent &&
                    getPlayerId(striker) === getPlayerId(player);
                  const canEdit = player.isNotOut && isCurrent;

                  return (
                    <tr
                      key={player.playerId || index}
                      className={canEdit ? "text-blue-500" : "opacity-80"}
                    >
                      <td className="px-3 py-2 text-left">
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() =>
                              onEditPlayer(
                                getPlayerId(striker) === getPlayerId(player)
                                  ? "striker"
                                  : "nonStriker",
                                player.name,
                              )
                            }
                            className="flex w-full items-center gap-1.5 text-left"
                          >
                            <span className="truncate">
                              {player.name}
                              {isStriker ? "*" : ""}
                            </span>
                            <Pencil size={12} className="shrink-0 opacity-50" />
                          </button>
                        ) : (
                          <>
                            <span className="block truncate">
                              {player.name}
                              {isStriker ? "*" : ""}
                            </span>
                            <span className="block truncate text-[10px] text-base-content/50">
                              {player.dismissal}
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {stats.runs ?? 0}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {stats.balls ?? 0}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {stats.fours ?? 0}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {stats.sixes ?? 0}
                      </td>
                      <td className="px-1 py-2 text-center">{sr}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-3 text-center italic text-base-content/40"
                  >
                    No batting data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AccordionSection>

      {/* Extras */}
      <AccordionSection
        title="Extras"
        subtitle={`Total ${extrasTotal}`}
        defaultOpen
      >
        <div className="grid grid-cols-5 gap-2 text-center text-[.75rem]">
          {[
            { label: "WD", value: extras.wideBallRun },
            { label: "NB", value: extras.noBallRun },
            { label: "LB", value: extras.legByes },
            { label: "B", value: extras.byes },
            { label: "OV", value: extras.overthrow },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-md bg-base-content/5 px-1 py-2"
            >
              <p className="font-semibold text-base-content/60">{item.label}</p>
              <p className="font-bold">{item.value || 0}</p>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Bowling */}
      <AccordionSection
        title="Bowling"
        subtitle={`${bowlers.length} bowler${bowlers.length === 1 ? "" : "s"}`}
        defaultOpen
      >
        <div className="overflow-hidden rounded-md border border-base-content/15">
          <table className="w-full table-fixed text-[.8rem]">
            <thead className="bg-base-content/5 text-base-content/70">
              <tr>
                <th className="w-auto px-3 py-2 text-left">Bowler</th>
                <th className="w-10 px-1 py-2">O</th>
                <th className="w-9 px-1 py-2">R</th>
                <th className="w-9 px-1 py-2">W</th>
                <th className="w-11 px-1 py-2">M</th>
                <th className="w-14 px-1 py-2">ECO</th>
              </tr>
            </thead>
            <tbody>
              {bowlers.length > 0 ? (
                bowlers.map((bowler) => {
                  const eco = economyOf(bowler);
                  const canEdit = bowler.isCurrent && isCurrent;

                  return (
                    <tr
                      key={bowler.id}
                      className={canEdit ? "text-blue-500" : "opacity-80"}
                    >
                      <td className="px-3 py-2 text-left">
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() =>
                              onEditPlayer("bowler", bowler.name || "")
                            }
                            className="flex w-full items-center gap-1.5 text-left"
                          >
                            <span className="truncate">
                              {bowler.name || "Unknown"} *
                            </span>
                            <Pencil size={12} className="shrink-0 opacity-50" />
                          </button>
                        ) : (
                          <span className="block truncate">
                            {bowler.name || "Unknown"}
                          </span>
                        )}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {formatOvers(bowler.balls)}
                      </td>
                      <td className="px-1 py-2 text-center">{bowler.runs}</td>
                      <td className="px-1 py-2 text-center">
                        {bowler.wickets}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {bowler.maidens || 0}
                      </td>
                      <td className="px-1 py-2 text-center">
                        {eco != null ? eco.toFixed(1) : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-3 text-center italic text-base-content/40"
                  >
                    No bowling data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AccordionSection>

      {/* Fall of wickets */}
      <AccordionSection
        title="Fall of Wickets"
        subtitle={
          fallOfWickets.length > 0
            ? `${fallOfWickets.length} wicket${fallOfWickets.length === 1 ? "" : "s"}`
            : "No wickets yet"
        }
        defaultOpen={fallOfWickets.length > 0}
      >
        {fallOfWickets.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-[.75rem]">
            {fallOfWickets.map((fow) => (
              <div
                key={fow.wicket}
                className="rounded-md bg-base-content/5 px-2 py-1"
              >
                <span className="font-bold">{fow.runs}</span>
                <span className="text-base-content/70">
                  /{fow.wicket} · {fow.name} ({fow.balls}b)
                  {fow.over && ` · ${fow.over} ov`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-base-content/40">No wickets yet</p>
        )}
      </AccordionSection>

      {(striker || nonStriker) && isCurrent && (
        <p className="text-[11px] text-base-content/45">
          * denotes the batsman currently on strike
        </p>
      )}
    </section>
  );
};

export const LocalMatchScoreboard = () => {
  const { currentMatchData } = useSelector((state) => state.score);
  const [editing, setEditing] = useState(null);

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
    <div className="w-full px-3 pb-10 pt-24">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {currentMatchData.matchStatus === "completed" &&
          currentMatchData.matchResult && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary">
              {currentMatchData.matchResult}
            </div>
          )}

        {/* Live/most recent inning first */}
        {[...innings]
          .map((inning, index) => ({
            inning,
            isCurrent: index + 1 === currentInningNumber,
          }))
          .reverse()
          .map(({ inning, isCurrent }, index) => (
            <InningSection
              key={inning.inning || index}
              match={currentMatchData}
              inning={inning}
              isCurrent={isCurrent}
              currentPlayers={currentMatchData.currentPlayers}
              onEditPlayer={(position, name) => setEditing({ position, name })}
            />
          ))}

        <Link
          to=".."
          relative="path"
          className="btn btn-sm btn-outline self-center rounded-lg"
        >
          Back to scoring
        </Link>
      </div>

      {editing && (
        <RenamePlayerModal
          position={editing.position}
          currentName={editing.name}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};