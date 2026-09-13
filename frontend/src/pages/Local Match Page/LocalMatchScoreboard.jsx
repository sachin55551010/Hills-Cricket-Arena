import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

const InningSection = ({ match, inning, isCurrent, currentPlayers }) => {
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

  // Dismissed batsmen: outPlayers carries their battingStats snapshot
  const outPlayers = inning.outPlayers || [];

  // Current batsmen (only for the live inning)
  const striker = isCurrent ? currentPlayers?.striker : null;
  const nonStriker = isCurrent ? currentPlayers?.nonStriker : null;

  // Bowlers are read from the over history (one entry per completed/ongoing over)
  const overHistory = inning.overHistory || [];
  const bowlerMap = new Map();
  overHistory.forEach((over) => {
    const key = over.bowlerId || over.bowlerName;
    if (!key) return;
    if (!bowlerMap.has(key)) {
      bowlerMap.set(key, {
        id: key,
        name: over.bowlerName || "",
        balls: 0,
        runs: 0,
        wickets: 0,
      });
    }
    const entry = bowlerMap.get(key);
    entry.balls += over.legalBalls || 0;
    entry.runs += over.runs || 0;
    entry.wickets += over.wickets || 0;
  });

  const bowlers = [...bowlerMap.values()];
  const currentBowlerId = isCurrent ? currentPlayers?.bowler?.playerId : null;

  // Fall of wickets: 1st out player aligns with 1st wicket of the inning
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

  return (
    <section className="flex flex-col gap-3 mt-10">
      {/* Inning header */}
      <div className="flex items-end justify-between border-b border-base-content/15 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold">{battingTeamName}</h3>
            <span className="text-[11px] rounded-md bg-base-content/10 px-2 py-0.5 text-base-content/70">
              {inning.inning === 1 ? "1st Inning" : "2nd Inning"}
            </span>
          </div>
          <p className="text-xs text-base-content/50">
            vs{" "}
            {inning.bowlingTeam || getTeamNameById(match, inning.bowlingTeamId)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold leading-none">
            {inning.runs ?? 0}-{inning.wickets ?? 0}
          </p>
          <p className="text-xs text-base-content/60">
            ({formatOvers(totalBalls)} ov) · CRR {runRate}
          </p>
        </div>
      </div>

      {/* Batting */}
      <div className="overflow-hidden rounded-md border border-base-content/15">
        <table className="w-full table-fixed text-[.8rem]">
          <thead className="bg-base-content/5 text-base-content/70">
            <tr>
              <th className="w-auto text-left px-3 py-2">Batsman</th>
              <th className="w-9 px-1 py-2">R</th>
              <th className="w-9 px-1 py-2">B</th>
              <th className="w-9 px-1 py-2">4s</th>
              <th className="w-9 px-1 py-2">6s</th>
              <th className="w-14 px-1 py-2">SR</th>
            </tr>
          </thead>
          <tbody>
            {/* Current batsmen */}
            {[striker, nonStriker].map((player, index) => {
              if (!player) return null;
              const stats = player.battingStats || {};
              const sr =
                stats.strikeRate != null ? stats.strikeRate.toFixed(1) : "0.0";
              return (
                <tr
                  key={getPlayerId(player) || `current-${index}`}
                  className="text-blue-500"
                >
                  <td className="text-left px-3 py-2 truncate">
                    {player.name}
                    {index === 0 ? "*" : ""}
                  </td>
                  <td className="text-center px-1 py-2">{stats.runs ?? 0}</td>
                  <td className="text-center px-1 py-2">{stats.balls ?? 0}</td>
                  <td className="text-center px-1 py-2">{stats.fours ?? 0}</td>
                  <td className="text-center px-1 py-2">{stats.sixes ?? 0}</td>
                  <td className="text-center px-1 py-2">{sr}</td>
                </tr>
              );
            })}

            {/* Dismissed batsmen */}
            {outPlayers.map((player, index) => {
              const stats = player.battingStats || {};
              const sr =
                stats.strikeRate != null ? stats.strikeRate.toFixed(1) : "0.0";
              const dismissal =
                player.wicketType === "Run Out"
                  ? `run out (${player.fielder?.name || "fielder"})`
                  : player.wicketType === "Caught"
                    ? `c ${player.fielder?.name || ""} b ${player.bowlerName || ""}`
                    : player.wicketType === "Stumped"
                      ? `st ${player.fielder?.name || ""} b ${player.bowlerName || ""}`
                      : player.wicketType
                        ? `${player.wicketType.toLowerCase()} b ${player.bowlerName || ""}`
                        : "out";
              return (
                <tr
                  key={player.playerId || player.id || index}
                  className="opacity-70"
                >
                  <td className="text-left px-3 py-2">
                    <span className="block truncate">{player.name}</span>
                    <span className="block truncate text-[10px] text-base-content/50">
                      {dismissal}
                    </span>
                  </td>
                  <td className="text-center px-1 py-2">{stats.runs ?? 0}</td>
                  <td className="text-center px-1 py-2">{stats.balls ?? 0}</td>
                  <td className="text-center px-1 py-2">{stats.fours ?? 0}</td>
                  <td className="text-center px-1 py-2">{stats.sixes ?? 0}</td>
                  <td className="text-center px-1 py-2">{sr}</td>
                </tr>
              );
            })}

            {!striker && !nonStriker && outPlayers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-3 text-center text-base-content/40 italic"
                >
                  No batting data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Extras */}
      <div className="rounded-md border border-base-content/15 p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Extras</p>
          <p className="text-sm font-bold">{extrasTotal}</p>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2 text-center text-[.75rem]">
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
      </div>

      {/* Bowling */}
      <div className="overflow-hidden rounded-md border border-base-content/15">
        <table className="w-full table-fixed text-[.8rem]">
          <thead className="bg-base-content/5 text-base-content/70">
            <tr>
              <th className="w-auto text-left px-3 py-2">Bowler</th>
              <th className="w-10 px-1 py-2">O</th>
              <th className="w-9 px-1 py-2">R</th>
              <th className="w-9 px-1 py-2">W</th>
              <th className="w-14 px-1 py-2">ECO</th>
            </tr>
          </thead>
          <tbody>
            {bowlers.length > 0 ? (
              bowlers.map((bowler) => {
                const eco = economyOf(bowler);
                const isCurrent = bowler.id === currentBowlerId;
                return (
                  <tr
                    key={bowler.id}
                    className={isCurrent ? "text-blue-500" : "opacity-80"}
                  >
                    <td className="text-left px-3 py-2 truncate">
                      {bowler.name || "Unknown"}
                      {isCurrent ? " *" : ""}
                    </td>
                    <td className="text-center px-1 py-2">
                      {formatOvers(bowler.balls)}
                    </td>
                    <td className="text-center px-1 py-2">{bowler.runs}</td>
                    <td className="text-center px-1 py-2">{bowler.wickets}</td>
                    <td className="text-center px-1 py-2">
                      {eco != null ? eco.toFixed(1) : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-3 text-center text-base-content/40 italic"
                >
                  No bowling data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fall of wickets */}
      <div className="rounded-md border border-base-content/15 p-3">
        <p className="text-sm font-semibold">Fall of Wickets</p>
        {fallOfWickets.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2 text-[.75rem]">
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
          <p className="mt-1 text-xs text-base-content/40 italic">
            No wickets yet
          </p>
        )}
      </div>
    </section>
  );
};

export const LocalMatchScoreboard = () => {
  const { currentMatchData } = useSelector((state) => state.score);

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
    </div>
  );
};
