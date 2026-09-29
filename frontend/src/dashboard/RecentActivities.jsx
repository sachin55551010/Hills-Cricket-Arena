import { useState } from "react";
import {
  Users,
  Trophy,
  Shield,
  Clock,
  Calendar,
  MapPin,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useGetRecentActivitiesQuery } from "../store/superAdminApi";

/* ─── helpers ──────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_BADGE = {
  Upcoming:  "badge-warning",
  Ongoing:   "badge-success",
  Completed: "badge-neutral",
  Cancelled: "badge-error",
  Abandoned: "badge-error",
  Postponed: "badge-info",
  Inactive:  "badge-ghost",
};

const CATEGORY_LABEL = {
  open:             "Open",
  panchayat:        "Panchayat",
  "panchayat+open": "Panchayat + Open",
  corporate:        "Corporate",
};

/* ─── skeleton row ─────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
      <div className="skeleton w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-36 rounded" />
        <div className="skeleton h-2 w-24 rounded" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
  );
}

/* ─── avatar ────────────────────────────────────────────────────── */
function Avatar({ src, fallback, color }) {
  if (src) {
    return (
      <img
        src={src}
        alt={fallback}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-base-300"
      />
    );
  }
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${color}`}
    >
      {fallback?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

/* ─── empty state ──────────────────────────────────────────────── */
function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-base-content/40 gap-2">
      <Clock size={28} className="opacity-40" />
      <p className="text-sm">No recent {label}</p>
    </div>
  );
}

/* ─── section wrapper ──────────────────────────────────────────── */
function Section({ title, icon: Icon, gradient, count, children }) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm">
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow`}>
              <Icon className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-base-content text-sm">{title}</h3>
              <p className="text-xs text-base-content/40">{count} new in last 48 h</p>
            </div>
          </div>
          {count > 0 && (
            <span className="badge badge-primary badge-sm">{count}</span>
          )}
        </div>
        <div className="px-3 py-2 divide-y divide-base-300/50">{children}</div>
      </div>
    </div>
  );
}

/* ─── Players section ──────────────────────────────────────────── */
function RecentPlayers({ players, isLoading }) {
  return (
    <Section
      title="New Players"
      icon={Users}
      gradient="from-sky-500 to-blue-600"
      count={players?.length ?? 0}
    >
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
        : !players?.length
        ? <EmptyState label="players" />
        : players.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-300/50 transition-colors duration-150 group"
            >
              <Avatar
                src={p.profilePicture}
                fallback={p.playerName}
                color="from-sky-400 to-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content truncate">
                  {p.playerName}
                </p>
                <p className="text-xs text-base-content/50 flex items-center gap-1">
                  <Clock size={10} />
                  {timeAgo(p.createdAt)}
                </p>
              </div>
              <span className="text-xs text-base-content/40 hidden group-hover:flex items-center gap-1">
                <Calendar size={10} />
                {formatDate(p.createdAt)}
              </span>
            </div>
          ))}
    </Section>
  );
}

/* ─── Teams section ─────────────────────────────────────────────── */
function RecentTeams({ teams, isLoading }) {
  return (
    <Section
      title="New Teams"
      icon={Shield}
      gradient="from-emerald-500 to-teal-600"
      count={teams?.length ?? 0}
    >
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
        : !teams?.length
        ? <EmptyState label="teams" />
        : teams.map((t) => (
            <div
              key={t._id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-300/50 transition-colors duration-150 group"
            >
              <Avatar
                src={t.teamLogo}
                fallback={t.teamName}
                color="from-emerald-400 to-teal-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content truncate">
                  {t.teamName}
                </p>
                <p className="text-xs text-base-content/50 flex items-center gap-1 truncate">
                  <MapPin size={10} />
                  {t.city}
                  {t.tournamentId?.tournamentName && (
                    <>
                      <ChevronRight size={10} />
                      {t.tournamentId.tournamentName}
                    </>
                  )}
                </p>
              </div>
              <span className="text-xs text-base-content/40">
                {timeAgo(t.createdAt)}
              </span>
            </div>
          ))}
    </Section>
  );
}

/* ─── Tournaments section ───────────────────────────────────────── */
function RecentTournaments({ tournaments, tournamentsByCategory, isLoading }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "open", "panchayat", "panchayat+open", "corporate"];

  const displayed =
    activeCategory === "all"
      ? tournaments
      : tournamentsByCategory?.[activeCategory] ?? [];

  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm">
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow">
              <Trophy className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-base-content text-sm">Tournaments</h3>
              <p className="text-xs text-base-content/40">
                {tournaments?.length ?? 0} new in last 48 h
              </p>
            </div>
          </div>
        </div>

        {/* category filter tabs */}
        <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-xs rounded-full shrink-0 transition-all duration-200 ${
                activeCategory === cat
                  ? "btn-primary shadow"
                  : "btn-ghost border border-base-300"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_LABEL[cat]}
              {cat !== "all" && tournamentsByCategory?.[cat]?.length > 0 && (
                <span className="ml-1 opacity-70">
                  ({tournamentsByCategory[cat].length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="px-3 pb-3 divide-y divide-base-300/50">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            : !displayed?.length
            ? <EmptyState label="tournaments" />
            : displayed.map((tr) => (
                <div
                  key={tr._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-300/50 transition-colors duration-150"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm shrink-0">
                    {tr.tournamentName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-base-content truncate">
                      {tr.tournamentName}
                    </p>
                    <p className="text-xs text-base-content/50 flex items-center gap-1">
                      <MapPin size={10} />
                      {tr.city}
                      <span className="mx-1">·</span>
                      {CATEGORY_LABEL[tr.tournamentCategory] ?? tr.tournamentCategory}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`badge badge-xs ${
                        STATUS_BADGE[tr.status] ?? "badge-neutral"
                      }`}
                    >
                      {tr.status}
                    </span>
                    <span className="text-xs text-base-content/40">
                      {timeAgo(tr.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */
export function RecentActivities() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetRecentActivitiesQuery();

  return (
    <div className="px-4 md:px-6 py-6 space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
            <Zap className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-content">
              Recent Activities
            </h1>
            <p className="text-xs text-base-content/50">
              Platform-wide overview · last 48 hours
            </p>
          </div>
        </div>

        <button
          onClick={refetch}
          disabled={isFetching}
          className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary"
          title="Refresh"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          <span className="hidden sm:inline text-xs">Refresh</span>
        </button>
      </div>

      {/* Error banner */}
      {isError && (
        <div className="alert alert-error shadow text-sm gap-2">
          <AlertCircle size={16} />
          <span>Failed to load recent activities. Please refresh.</span>
          <button onClick={refetch} className="btn btn-sm btn-ghost ml-auto">
            Retry
          </button>
        </div>
      )}

      {/* Players + Teams grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentPlayers players={data?.recent?.players} isLoading={isLoading} />
        <RecentTeams teams={data?.recent?.teams} isLoading={isLoading} />
      </div>

      {/* Full-width tournaments */}
      <RecentTournaments
        tournaments={data?.recent?.tournaments}
        tournamentsByCategory={data?.tournamentsByCategory}
        isLoading={isLoading}
      />
    </div>
  );
}
