import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllDataInNumberQuery } from "../store/superAdminApi";
import { useGetMyTournamentQuery } from "../store/tournamentApi";
import { useGetAllMatchesQuery } from "../store/matchApi";
import { defaultAvatar } from "../utils/noprofilePicHelper";

import {
  Trophy,
  Swords,
  Users,
  Shield,
  MapPin,
  Calendar,
  ChevronRight,
  Zap,
  TrendingUp,
  PlusCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

const DATE_OPTS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const STATUS_BADGE = {
  Upcoming: "badge-info",
  Ongoing: "badge-warning",
  Completed: "badge-success",
  Cancelled: "badge-error",
  Abandoned: "badge-error",
  Postponed: "badge-neutral",
  Inactive: "badge-error",
  live: "badge-success",
  scheduled: "badge-warning",
  completed: "badge-success",
  abandoned: "badge-warning",
};

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */

function StatCard({ icon: Icon, label, count, gradient, isLoading }) {
  return (
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-base-content/10 bg-base-100 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-base-content/15 hover:shadow-sm">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}
      >
        <Icon size={18} className="text-white" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase tracking-wider text-base-content/45">
          {label}
        </p>

        {isLoading ? (
          <div className="skeleton mt-1 h-6 w-12 rounded" />
        ) : (
          <p className="mt-0.5 text-xl font-bold leading-none tabular-nums text-base-content">
            {count?.toLocaleString() ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section Header
───────────────────────────────────────────── */

function SectionHeader({ icon: Icon, title, linkTo, linkLabel }) {
  const navigate = useNavigate();

  return (
    <div className="mb-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon size={14} className="text-primary" />
        </div>

        <h2 className="text-sm font-bold tracking-tight text-base-content">
          {title}
        </h2>
      </div>

      {linkTo && (
        <button
          onClick={() => navigate(linkTo)}
          className="group flex items-center gap-0.5 text-xs font-semibold text-primary transition-opacity hover:opacity-70"
        >
          {linkLabel}
          <ChevronRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tournament Card
───────────────────────────────────────────── */

function TournamentCard({ tournament }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/my-tournament/${tournament._id}`)}
      className="w-56 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-base-content/10 bg-base-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-base-content/20 hover:shadow-md"
    >
      <div className="p-3.5">
        <div
          className={`mb-2.5 w-fit badge badge-sm badge-soft ${
            STATUS_BADGE[tournament.status] ?? "badge-ghost"
          } text-[10px] font-semibold`}
        >
          {tournament.status}
        </div>

        <p className="line-clamp-2 text-sm font-bold leading-snug text-base-content">
          {tournament.tournamentName}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-base-content/8 bg-base-200/30 px-3.5 py-2.5 text-[10px] font-medium text-base-content/45">
        <span className="truncate capitalize">
          {tournament.city || "Unknown"}
        </span>

        <span className="shrink-0">
          {tournament.startDate
            ? new Date(tournament.startDate).toLocaleDateString("en", DATE_OPTS)
            : "TBD"}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Match Card
───────────────────────────────────────────── */

function MatchCard({ match }) {
  const navigate = useNavigate();
  const isLive = match.status?.toLowerCase() === "live";

  return (
    <div
      onClick={() => navigate(`/match/${match._id}`)}
      className="w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-base-content/10 bg-base-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-base-content/20 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-base-content/8 px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Trophy size={12} className="shrink-0 text-primary" />

          <p className="truncate text-[10px] font-semibold text-base-content/55">
            {match.tournamentId?.tournamentName}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
          )}

          <span
            className={`badge badge-sm badge-soft ${
              STATUS_BADGE[match.status?.toLowerCase()] ?? "badge-ghost"
            } text-[10px]`}
          >
            {match.status}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        {/* Team 1 */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          {match.firstTeamId?.teamLogo ? (
            <img
              src={match.firstTeamId.teamLogo}
              alt={match.firstTeamId.teamName}
              className="h-11 w-11 rounded-full object-cover ring-1 ring-base-content/10"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {defaultAvatar(match.firstTeamId?.teamName)}
            </div>
          )}

          <p className="w-full truncate text-center text-[10px] font-semibold">
            {match.firstTeamId?.teamName}
          </p>
        </div>

        {/* VS */}
        <span className="shrink-0 text-[9px] font-bold tracking-widest text-base-content/25">
          VS
        </span>

        {/* Team 2 */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          {match.secondTeamId?.teamLogo ? (
            <img
              src={match.secondTeamId.teamLogo}
              alt={match.secondTeamId.teamName}
              className="h-11 w-11 rounded-full object-cover ring-1 ring-base-content/10"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
              {defaultAvatar(match.secondTeamId?.teamName)}
            </div>
          )}

          <p className="w-full truncate text-center text-[10px] font-semibold">
            {match.secondTeamId?.teamName}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between bg-base-200/30 px-3.5 py-2.5 text-[10px] text-base-content/45">
        <div className="flex min-w-0 items-center gap-1">
          <MapPin size={10} className="shrink-0" />
          <span className="truncate capitalize">
            {match.tournamentId?.city}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Calendar size={10} />
          <span>
            {new Date(match.matchScheduleDate).toLocaleDateString(
              "en",
              DATE_OPTS,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Quick Action
───────────────────────────────────────────── */

function QuickAction({ icon: Icon, label, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-base-content/10 bg-base-100 px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-base-content/20 hover:shadow-sm"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} transition-transform duration-200 group-hover:scale-105`}
      >
        <Icon size={16} className="text-white" />
      </div>

      <span className="truncate text-xs font-semibold text-base-content/70 transition-colors group-hover:text-base-content">
        {label}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────
   Home Page
───────────────────────────────────────────── */

export const HomePage = () => {
  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);

  const { data: statsData, isLoading: statsLoading } =
    useGetAllDataInNumberQuery();

  const { data: myTourneyData, isLoading: myTourneyLoading } =
    useGetMyTournamentQuery();

  const { data: matchData, isLoading: matchLoading } =
    useGetAllMatchesQuery("open");

  const myTournaments = myTourneyData?.myTournaments ?? [];
  const recentTournaments = myTournaments.slice(0, 6);

  const allMatches = matchData?.allMatches ?? [];

  const sortedMatches = [...allMatches].sort((a, b) => {
    const priority = {
      live: 0,
      scheduled: 1,
    };

    return (
      (priority[a.status?.toLowerCase()] ?? 2) -
      (priority[b.status?.toLowerCase()] ?? 2)
    );
  });

  const recentMatches = sortedMatches.slice(0, 6);

  return (
    <main className="min-h-dvh bg-base-200/30 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ───────────────── Header ───────────────── */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-base-content/40">
              Dashboard
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-base-content sm:text-2xl">
              Welcome back
            </h1>
          </div>

          <button
            onClick={() => navigate(`/profile/${authUser?.player?._id}`)}
            className="flex mt-14 h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-base-content/10 bg-base-100 transition hover:border-base-content/20 hover:shadow-sm"
          >
            {authUser?.player?.profilePic ? (
              <img
                src={authUser.player.profilePic}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <Users size={16} className="text-base-content/50 " />
            )}
          </button>
        </header>

        {/* ───────────────── Platform Stats ───────────────── */}
        <section>
          <SectionHeader icon={TrendingUp} title="Platform Stats" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={Trophy}
              label="Tournaments"
              count={statsData?.data?.totalTournaments}
              gradient="from-amber-500 to-orange-500"
              isLoading={statsLoading}
            />

            <StatCard
              icon={Shield}
              label="Teams"
              count={statsData?.data?.totalTeams}
              gradient="from-emerald-500 to-teal-500"
              isLoading={statsLoading}
            />

            <StatCard
              icon={Users}
              label="Players"
              count={statsData?.data?.totalPlayers}
              gradient="from-sky-500 to-blue-600"
              isLoading={statsLoading}
            />
          </div>
        </section>

        {/* ───────────────── Quick Actions ───────────────── */}
        <section>
          <SectionHeader icon={Zap} title="Quick Actions" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction
              icon={PlusCircle}
              label="New Tournament"
              gradient="from-violet-500 to-purple-600"
              onClick={() => navigate("/add-tournament")}
            />

            <QuickAction
              icon={Trophy}
              label="My Tournaments"
              gradient="from-amber-500 to-orange-500"
              onClick={() => navigate("/my-tournament")}
            />

            <QuickAction
              icon={Swords}
              label="All Matches"
              gradient="from-emerald-500 to-teal-500"
              onClick={() => navigate("/all-matches")}
            />

            <QuickAction
              icon={Users}
              label="Profile"
              gradient="from-sky-500 to-blue-600"
              onClick={() => navigate(`/profile/${authUser?.player?._id}`)}
            />
          </div>
        </section>

        {/* ───────────────── My Tournaments ───────────────── */}
        <section>
          <SectionHeader
            icon={Trophy}
            title="My Tournaments"
            linkTo="/my-tournament"
            linkLabel="See all"
          />

          {myTourneyLoading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-28 w-56 shrink-0 rounded-xl"
                />
              ))}
            </div>
          ) : recentTournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-base-content/15 bg-base-100/60 py-10 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-base-200">
                <Trophy size={18} className="text-base-content/30" />
              </div>

              <p className="text-sm font-semibold text-base-content/50">
                No tournaments yet
              </p>

              <button
                onClick={() => navigate("/create-tournament")}
                className="btn btn-sm btn-primary mt-3 rounded-lg"
              >
                Create tournament
              </button>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {recentTournaments.map((tournament) => (
                <TournamentCard key={tournament._id} tournament={tournament} />
              ))}
            </div>
          )}
        </section>

        {/* ───────────────── Recent Matches ───────────────── */}
        <section>
          <SectionHeader
            icon={Swords}
            title="Recent Matches"
            linkTo="/all-matches"
            linkLabel="See all"
          />

          {matchLoading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-36 w-64 shrink-0 rounded-xl"
                />
              ))}
            </div>
          ) : recentMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-base-content/15 bg-base-100/60 py-10 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-base-200">
                <Swords size={18} className="text-base-content/30" />
              </div>

              <p className="text-sm font-semibold text-base-content/50">
                No matches found
              </p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {recentMatches.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
