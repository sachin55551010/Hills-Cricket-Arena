export const BowlingStats = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <section className="w-full">
        <div className="mb-5">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton mt-2 h-3 w-48" />
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-base-300 bg-base-100 p-4"
            >
              <div className="skeleton h-3 w-16" />
              <div className="skeleton mt-3 h-7 w-12" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const careerStats = data?.playerProfile?.careerStats;

  // Fixed: bowling instead of batting
  const bowlingStats = careerStats?.bowling;
  // Convert camelCase / PascalCase into readable words
  const formatLabel = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase());
  };
  const bowlingStatArray = bowlingStats
    ? Object.entries(bowlingStats).map(([key, value]) => ({
        label: formatLabel(key),
        value,
      }))
    : [];

  const stats = [
    {
      label: "Matches",
      value: careerStats?.matches ?? 0,
    },
    ...bowlingStatArray,
  ];

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between border-b border-base-300 pb-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-base-content">
            Bowling Stats
          </h2>
          <p className="mt-0.5 text-xs text-base-content/50">
            Career bowling performance
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="group rounded-xl border border-base-300 bg-base-100 p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-sm flex flex-col items-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
              {label}
            </p>

            <p className="mt-2 font-bold tracking-tight text-base-content">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
