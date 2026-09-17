import { useSelector } from "react-redux";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const LocalMatchSummary = ({ matchData } = {}) => {
  const { currentMatchData } = useSelector((state) => state.score);

  const sourceMatch = matchData || currentMatchData;
  const innings = sourceMatch?.innings || [];

  if (!innings.length) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-base-content/40">
        No match data available
      </div>
    );
  }

  // --------------------------------------------------
  // Run progression data
  // --------------------------------------------------

  const teamScores = {};

  innings.forEach((inning) => {
    const teamName = inning.battingTeam;

    let cumulativeRuns = 0;

    teamScores[teamName] = [];

    inning.overHistory?.forEach((over) => {
      cumulativeRuns += Number(over.runs || 0);

      teamScores[teamName].push({
        over: over.over,
        runs: cumulativeRuns,
      });
    });
  });

  const maxOvers = Math.max(
    ...Object.values(teamScores).map((scores) => scores.length),
  );

  const chartData = Array.from({ length: maxOvers }, (_, i) => {
    const data = {
      over: i + 1,
    };

    Object.entries(teamScores).forEach(([team, scores]) => {
      data[team] = scores[i]?.runs ?? null;
    });

    return data;
  });

  // --------------------------------------------------
  // Final score data for bar chart
  // --------------------------------------------------

  const overBarData = Array.from({ length: maxOvers }, (_, i) => {
    const data = {
      over: i + 1,
    };

    innings.forEach((inning) => {
      const over = inning.overHistory?.[i];

      data[inning.battingTeam] = over ? Number(over.runs || 0) : null;
    });

    return data;
  });

  // Same color theme for both charts
  const COLORS = ["#2a78d6", "#ef4444"];

  // --------------------------------------------------
  // Tooltip
  // --------------------------------------------------

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl bg-base-100 border border-base-content/10 shadow-lg px-4 py-3 text-sm">
        <p className="text-base-content/50 text-xs mb-2 font-medium">
          {typeof label === "number" ? `Over ${label}` : label}
        </p>

        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />

            <span className="text-base-content/70">{p.name}</span>

            <span className="ml-auto font-medium text-base-content">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="w-full rounded-2xl bg-base-100 border border-base-content/10 p-6 space-y-8 ">
      {/* Header */}
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest">
          Match summary
        </p>

        <h2 className="text-base font-medium text-base-content">
          Run progression
        </h2>

        <p className="text-sm text-base-content/50">
          Cumulative runs scored per over
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5">
        {innings.map((inning, i) => (
          <div
            key={inning.battingTeamId || inning.battingTeam}
            className="flex items-center gap-2 text-xs text-base-content/60"
          >
            <span
              className="inline-block h-0.5 w-5 rounded-full"
              style={{
                background: COLORS[i],
                ...(i === 1 && {
                  background:
                    "repeating-linear-gradient(90deg,#ef4444 0 4px,transparent 4px 7px)",
                }),
              }}
            />

            {inning.battingTeam}
          </div>
        ))}
      </div>

      {/* -------------------------------------------- */}
      {/* Line Chart */}
      {/* -------------------------------------------- */}

      <div className="h-[240px] w-full no-chart-focus">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 4,
              right: 4,
              left: -16,
              bottom: 16,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.06}
              vertical={false}
            />

            <XAxis
              dataKey="over"
              tick={{
                fontSize: 11,
                fill: "currentColor",
                opacity: 0.4,
              }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Over",
                position: "insideBottom",
                offset: -10,
                fontSize: 12,
                opacity: 0.5,
              }}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fontSize: 11,
                fill: "currentColor",
                opacity: 0.4,
              }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Runs",
                angle: -90,
                position: "insideLeft",
                offset: 12,
                fontSize: 12,
                opacity: 0.5,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "currentColor",
                strokeOpacity: 0.1,
                strokeWidth: 1,
              }}
            />

            {innings.map((inning, index) => (
              <Line
                key={inning.battingTeamId || inning.battingTeam}
                type="monotone"
                dataKey={inning.battingTeam}
                stroke={COLORS[index]}
                strokeWidth={2.5}
                strokeDasharray={index === 1 ? "6 3" : undefined}
                dot={{
                  r: 2.5,
                  fill: COLORS[index],
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "white",
                }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* -------------------------------------------- */}
      {/* Final Score Bar Chart */}
      {/* -------------------------------------------- */}

      <div className="pt-2 space-y-3 no-chart-focus">
        <div>
          <h3 className="text-sm font-medium text-base-content">
            Runs per over
          </h3>

          <p className="text-xs text-base-content/50">
            Runs scored by each team in every over
          </p>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overBarData}
              margin={{
                top: 10,
                right: 4,
                left: -16,
                bottom: 16,
              }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.06}
                vertical={false}
              />

              <XAxis
                dataKey="over"
                tick={{
                  fontSize: 11,
                  fill: "currentColor",
                  opacity: 0.4,
                }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Over",
                  position: "insideBottom",
                  offset: -10,
                  fontSize: 12,
                  opacity: 0.5,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "currentColor",
                  opacity: 0.4,
                }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Runs",
                  angle: -90,
                  position: "insideLeft",
                  offset: 12,
                  fontSize: 12,
                  opacity: 0.5,
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "currentColor",
                  fillOpacity: 0.04,
                }}
              />

              {innings.map((inning, index) => (
                <Bar
                  key={inning.battingTeamId || inning.battingTeam}
                  dataKey={inning.battingTeam}
                  name={inning.battingTeam}
                  fill={COLORS[index]}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                  activeBar={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
