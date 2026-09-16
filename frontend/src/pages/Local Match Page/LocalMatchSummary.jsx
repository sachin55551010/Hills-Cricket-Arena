import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const LocalMatchSummary = ({ matchData } = {}) => {
  const { currentMatchData } = useSelector((state) => state.score);

  const sourceMatch = matchData || currentMatchData;
  const innings = sourceMatch?.innings || [];

  // No innings available
  if (!innings.length) {
    return <div className="p-4 text-center">No match data available</div>;
  }

  /*
   * Create cumulative score for every over
   *
   * Example:
   *
   * Over 1 = 8 runs
   * Over 2 = 7 runs
   * Over 3 = 10 runs
   *
   * Chart:
   * Over 1 -> 8
   * Over 2 -> 15
   * Over 3 -> 25
   */

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

  /*
   * Convert into Recharts format
   *
   * [
   *   {
   *     over: 1,
   *     Kandaghat: 8,
   *     Solan: 6
   *   },
   *   ...
   * ]
   */

  const chartData = [];

  const maxOvers = Math.max(
    ...Object.values(teamScores).map((scores) => scores.length),
  );

  for (let i = 0; i < maxOvers; i++) {
    const data = {
      over: i + 1,
    };

    Object.entries(teamScores).forEach(([teamName, scores]) => {
      data[teamName] = scores[i]?.runs ?? null;
    });

    chartData.push(data);
  }

  return (
    <div className="w-full rounded-xl bg-base-100 pt-40 shadow-md">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Run Progression</h2>

        <p className="text-sm text-base-content/60">
          Runs scored over each over
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

            <XAxis
              dataKey="over"
              tickFormatter={(value) => `${value}`}
              label={{
                value: "Overs",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "Runs",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value, name) => [`${value} runs`, name]}
              labelFormatter={(over) => `Over ${over}`}
            />

            <Legend />

            {/* Lines */}
            {innings.map((inning, index) => {
              const team = inning.battingTeam;

              return (
                <Line
                  key={inning.battingTeamId}
                  type="monotone"
                  dataKey={team}
                  name={team}
                  stroke={index === 0 ? "#2563eb" : "#ef4444"}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                  connectNulls={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
