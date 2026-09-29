import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  X,
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Swords,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useGetAllMatchesQuery } from "../store/matchApi";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import noData from "../../assets/No data-amico.svg";
import { NoDataFoundPage } from "../components/NoDataFoundPage";

/* ─── constants ──────────────────────────────────────────────────── */
const CATEGORIES = [
  { key: "open",           label: "Open" },
  { key: "panchayat",      label: "Panchayat" },
  { key: "panchayat+open", label: "P + O" },
  { key: "corporate",      label: "Corporate" },
];

const STATUSES = [
  "Live",
  "Scheduled",
  "Completed",
  "Abandoned",
];

const STATUS_COLOR = {
  Live:      "badge-success",
  Scheduled: "badge-warning",
  Completed: "badge-info",
  Abandoned: "badge-error",
};

/* ─── helpers ──────────────────────────────────────────────────────── */
function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

/* ─── SearchBar ─────────────────────────────────────────────────── */
function SearchBar({ filter, onChange }) {
  const [showSugg, setShowSugg] = useState(false);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-base-300 bg-base-100">
      {/* Search input */}
      <div className="flex-1 relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none"
        />
        <input
          value={filter.search}
          onChange={(e) => {
            onChange({ ...filter, search: e.target.value });
            setShowSugg(!!e.target.value);
          }}
          onFocus={() => filter.search && setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          type="text"
          placeholder="Search matches…"
          className="w-full h-9 pl-9 pr-8 rounded-xl bg-base-200/80 border border-base-content/8 focus:border-primary/40 focus:bg-base-100 outline-none text-sm transition-all placeholder:text-base-content/35"
        />
        {filter.search && (
          <button
            onClick={() => onChange({ ...filter, search: "", value: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60"
          >
            <X size={13} />
          </button>
        )}

        {/* suggestion dropdown */}
        {showSugg && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-base-100 border border-base-content/10 rounded-2xl shadow-xl overflow-hidden z-50">
            <p className="px-3 pt-2.5 pb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-base-content/30">
              Search by
            </p>
            {[
              { label: "Tournament", key: "tournamentName" },
              { label: "Team",       key: "teamName" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onMouseDown={() => {
                  onChange({ ...filter, value: key });
                  setShowSugg(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-base-200/70 transition-colors text-left group"
              >
                <Search size={12} className="text-base-content/30 shrink-0 group-hover:text-primary" />
                <span className="text-base-content/55 truncate flex-1 text-xs">{filter.search}</span>
                <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status filter */}
      <div className="relative shrink-0">
        <select
          value={filter.status}
          onChange={(e) => onChange({ ...filter, status: e.target.value })}
          className="h-9 pl-3 pr-8 rounded-xl bg-base-200/80 border border-base-content/8 focus:border-primary/40 outline-none text-xs font-medium appearance-none cursor-pointer text-base-content/70"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ─── Team Avatar ───────────────────────────────────────────────── */
function TeamAvatar({ logo, name, side }) {
  const gradients = {
    first:  "from-primary/20 to-primary/10 text-primary",
    second: "from-secondary/20 to-secondary/10 text-secondary",
  };
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="h-11 w-11 rounded-full object-cover ring-2 ring-base-200"
      />
    );
  }
  return (
    <div
      className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-base-200 bg-gradient-to-br ${gradients[side]}`}
    >
      {defaultAvatar(name)}
    </div>
  );
}

/* ─── Match Card ────────────────────────────────────────────────── */
function MatchCard({ match, onClick }) {
  return (
    <li
      onClick={onClick}
      className="flex flex-col rounded-2xl bg-base-100 border border-base-content/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer group"
    >
      {/* ── Header: Tournament + Status ── */}
      <div className="px-4 pt-4 pb-3 border-b border-base-content/8">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy size={13} className="text-primary" />
            </div>
            <h3 className="text-xs font-semibold text-base-content truncate leading-tight">
              {match.tournamentId?.tournamentName}
            </h3>
          </div>
          <span
            className={`badge badge-sm badge-soft ${
              STATUS_COLOR[match.status] ?? "badge-ghost"
            } shrink-0 text-[.62rem]`}
          >
            {match.status}
          </span>
        </div>

        {/* City & Ground */}
        <div className="mt-2 flex flex-col gap-0.5 ml-9">
          <div className="flex items-center gap-1 text-[.68rem] text-base-content/50">
            <MapPin size={10} className="shrink-0 text-base-content/30" />
            <span className="font-medium text-base-content/60">City:</span>
            <span>{match.tournamentId?.city}</span>
          </div>
          <div className="flex items-center gap-1 text-[.68rem] text-base-content/50">
            <MapPin size={10} className="opacity-0 shrink-0" />
            <span className="font-medium text-base-content/60">Ground:</span>
            <span>{match.tournamentId?.ground}</span>
          </div>
        </div>
      </div>

      {/* ── Teams VS ── */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        {/* Team 1 */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <TeamAvatar logo={match.firstTeamId?.teamLogo} name={match.firstTeamId?.teamName} side="first" />
          <p className="text-xs font-semibold text-base-content text-center leading-tight line-clamp-1 max-w-[80px]">
            {match.firstTeamId?.teamName}
          </p>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1">
          <Swords size={16} className="text-base-content/25 group-hover:text-primary/40 transition-colors" />
          <span className="text-[.6rem] font-bold text-base-content/25 tracking-widest">VS</span>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <TeamAvatar logo={match.secondTeamId?.teamLogo} name={match.secondTeamId?.teamName} side="second" />
          <p className="text-xs font-semibold text-base-content text-center leading-tight line-clamp-1 max-w-[80px]">
            {match.secondTeamId?.teamName}
          </p>
        </div>
      </div>

      {/* ── Footer: Date, Round, Overs ── */}
      <div className="px-4 py-2.5 bg-base-200/40 border-t border-base-content/8 flex items-center justify-between gap-2 text-[.68rem] text-base-content/50 mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="shrink-0" />
          <span>{fmtDate(match.matchScheduleDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {match.round && (
            <span className="badge badge-soft badge-info text-[.6rem]">{match.round}</span>
          )}
          {match.overs && (
            <span className="flex items-center gap-0.5 badge badge-soft badge-neutral text-[.6rem]">
              <Clock size={9} />
              {match.overs} ov
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="rounded-2xl bg-base-100 border border-base-content/10 overflow-hidden animate-pulse">
          <div className="p-4 border-b border-base-content/8 space-y-2">
            <div className="skeleton h-3 w-40 rounded" />
            <div className="skeleton h-2 w-28 rounded" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 gap-3">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="skeleton w-11 h-11 rounded-full" />
              <div className="skeleton h-2 w-14 rounded" />
            </div>
            <div className="skeleton h-4 w-6 rounded" />
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="skeleton w-11 h-11 rounded-full" />
              <div className="skeleton h-2 w-14 rounded" />
            </div>
          </div>
          <div className="px-4 py-2.5 bg-base-200/40 flex items-center justify-between">
            <div className="skeleton h-2 w-20 rounded" />
            <div className="skeleton h-2 w-16 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ─── Main Export ───────────────────────────────────────────────── */
export function AllMatchListAdmin() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("open");
  const [filter, setFilter] = useState({ search: "", value: "", status: "" });

  const queryArgs = useMemo(
    () => ({
      tournamentCategory: activeCategory,
      searchData: filter,
    }),
    [activeCategory, filter],
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllMatchesQuery(queryArgs);

  const matches = data?.allMatches ?? [];
  const noMatches = !isLoading && matches.length === 0;

  return (
    <div className="flex flex-col min-h-0">
      {/* ── Header ── */}
      <div className="px-4 md:px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
            <Swords className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-content">All Matches</h1>
            <p className="text-xs text-base-content/50">
              {isLoading
                ? "Loading…"
                : `${matches.length} match${matches.length !== 1 ? "es" : ""} found`}
            </p>
          </div>
        </div>

        <button
          onClick={refetch}
          disabled={isFetching}
          className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          <span className="hidden sm:inline text-xs">Refresh</span>
        </button>
      </div>

      {/* ── Category tabs ── */}
      <div className="px-4 md:px-6 pb-1">
        <div className="flex items-center gap-1 overflow-x-auto">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key);
                setFilter({ search: "", value: "", status: "" });
              }}
              className={`btn btn-sm rounded-full shrink-0 transition-all duration-200 ${
                activeCategory === key
                  ? "btn-primary shadow"
                  : "btn-ghost border border-base-300 text-base-content/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Status filter ── */}
      <div className="mt-2">
        <SearchBar filter={filter} onChange={setFilter} />
      </div>

      {/* ── Match grid ── */}
      <div className="px-4 md:px-6 py-4 flex-1 overflow-y-auto">
        {isError && (
          <div className="alert alert-error mb-4 text-sm gap-2">
            <AlertTriangle size={15} />
            <span>Failed to load matches.</span>
            <button onClick={refetch} className="btn btn-xs btn-ghost ml-auto">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <SkeletonGrid />
        ) : noMatches ? (
          <NoDataFoundPage
            image={noData}
            title="No Matches Found"
            description="No matches available for this category / filter."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard
                key={match._id}
                match={match}
                onClick={() => navigate(`/match/${match._id}`)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
