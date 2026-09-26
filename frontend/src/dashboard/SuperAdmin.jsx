import { useGetAllDataInNumberQuery } from "../store/superAdminApi";
import {
  CalendarDays,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
  UsersRound,
} from "lucide-react";

const tournamentCategories = [
  { key: "open", label: "Open" },
  { key: "panchayat", label: "Panchayat" },
  { key: "panchayat+open", label: "Panchayat + Open" },
  { key: "corporate", label: "Corporate" },
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const EmptyList = ({ children }) => (
  <p className="px-4 py-5 text-sm text-base-content/50">{children}</p>
);

const RecentSection = ({ title, items, children }) => (
  <section className="min-w-0 overflow-hidden rounded-lg border border-base-300 bg-base-100">
    <header className="border-b border-base-300 px-4 py-3">
      <h3 className="text-sm font-semibold text-base-content">{title}</h3>
    </header>
    {items.length ? (
      <ul className="divide-y divide-base-300">
        {items.map((item) => (
          <li key={item._id} className="px-4 py-3">
            {children(item)}
          </li>
        ))}
      </ul>
    ) : (
      <EmptyList>No additions in the last 48 hours.</EmptyList>
    )}
  </section>
);

export const SuperAdmin = () => {
  const { data, isLoading, isError } = useGetAllDataInNumberQuery();
  const totals = data?.data;
  const recent = data?.recent;
  const tournamentsByCategory = data?.tournamentsByCategory;
  const metrics = [
    {
      label: "Total Players",
      value: totals?.totalPlayers,
      icon: <Users size={22} strokeWidth={1.8} />,
    },
    {
      label: "Total Teams",
      value: totals?.totalTeams,
      icon: <UsersRound size={22} strokeWidth={1.8} />,
    },
    {
      label: "Total Tournaments",
      value: totals?.totalTournaments,
      icon: <Trophy size={22} strokeWidth={1.8} />,
    },
  ];

  return (
    <main className="mx-auto min-h-[calc(100dvh-var(--nav-h))] w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center gap-3 border-b border-base-300 pb-5">
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck size={22} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-base-content">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-base-content/60">Platform overview</p>
        </div>
      </header>

      {isError && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          Dashboard data could not be loaded. Please try again.
        </p>
      )}

      <section
        aria-label="Platform totals"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {metrics.map(({ label, value, icon }) => (
          <article
            key={label}
            className="flex min-h-32 items-center justify-between rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-base-content/60">
                {label}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-base-content">
                {isLoading ? "..." : (value ?? 0).toLocaleString()}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </span>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={17} className="text-primary" />
          <h2 className="text-base font-bold text-base-content">
            Recent additions
          </h2>
          <span className="text-xs text-base-content/50">Last 48 hours</span>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <RecentSection title="Players" items={recent?.players ?? []}>
            {(player) => (
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium capitalize text-base-content">
                  {player.playerName}
                </p>
                <time className="shrink-0 text-xs text-base-content/50">
                  {formatDate(player.createdAt)}
                </time>
              </div>
            )}
          </RecentSection>

          <RecentSection title="Teams" items={recent?.teams ?? []}>
            {(team) => (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium capitalize text-base-content">
                    {team.teamName}
                  </p>
                  <p className="mt-1 truncate text-xs text-base-content/50">
                    {team.tournamentId?.tournamentName ?? team.city}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-base-content/50">
                  {formatDate(team.createdAt)}
                </time>
              </div>
            )}
          </RecentSection>

          <RecentSection title="Tournaments" items={recent?.tournaments ?? []}>
            {(tournament) => (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium capitalize text-base-content">
                    {tournament.tournamentName}
                  </p>
                  <p className="mt-1 truncate text-xs capitalize text-base-content/50">
                    {tournament.tournamentCategory.replace("+", " + ")}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-base-content/50">
                  {formatDate(tournament.createdAt)}
                </time>
              </div>
            )}
          </RecentSection>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Trophy size={17} className="text-primary" />
          <h2 className="text-base font-bold text-base-content">
            All tournaments
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {tournamentCategories.map(({ key, label }) => {
            const tournaments = tournamentsByCategory?.[key] ?? [];

            return (
              <section
                key={key}
                className="min-w-0 overflow-hidden rounded-lg border border-base-300 bg-base-100"
              >
                <header className="flex items-center justify-between border-b border-base-300 px-4 py-3">
                  <h3 className="text-sm font-semibold text-base-content">
                    {label}
                  </h3>
                  <span className="rounded-md bg-base-200 px-2 py-1 text-xs font-semibold tabular-nums text-base-content/60">
                    {tournaments.length}
                  </span>
                </header>
                {tournaments.length ? (
                  <ul className="divide-y divide-base-300">
                    {tournaments.map((tournament) => (
                      <li
                        key={tournament._id}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium capitalize text-base-content">
                            {tournament.tournamentName}
                          </p>
                          <p className="mt-1 flex items-center gap-1 truncate text-xs capitalize text-base-content/50">
                            <MapPin size={12} className="shrink-0" />
                            {tournament.city}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-base-200 px-2 py-1 text-[10px] font-medium text-base-content/60">
                          {tournament.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyList>No tournaments in this category.</EmptyList>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
};
