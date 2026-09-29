import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  X,
  Pencil,
  Trash2,
  Phone,
  User,
  MapPin,
  AlertTriangle,
  Trophy,
  Calendar,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  useGetAllTournamentsQuery,
  useSuperAdminUpdateTournamentMutation,
  useSuperAdminDeleteTournamentMutation,
} from "../store/tournamentApi";
import { DummyCardLoadingSkelton } from "../components/modals/DummyLoadingSkelton";
import { NoDataFoundPage } from "../components/NoDataFoundPage";
import noData from "../../assets/No data-amico.svg";

/* ─── constants ──────────────────────────────────────────────────── */
const CATEGORIES = [
  { key: "open",           label: "Open" },
  { key: "panchayat",      label: "Panchayat" },
  { key: "panchayat+open", label: "P + O" },
  { key: "corporate",      label: "Corporate" },
];

const STATUS_OPTIONS = [
  "Upcoming", "Ongoing", "Completed",
  "Cancelled", "Abandoned", "Postponed", "Inactive",
];

const STATUS_COLOR = {
  Upcoming:  "badge-info",
  Ongoing:   "badge-warning",
  Completed: "badge-success",
  Cancelled: "badge-warning",
  Abandoned: "badge-error",
  Postponed: "badge-neutral",
  Inactive:  "badge-error",
};

const DATE_FMT = { day: "2-digit", month: "short", year: "numeric" };
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en", DATE_FMT) : "N/A";

/* ─── inline SearchBar ───────────────────────────────────────────── */
function SearchBar({ filter, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchSelect = (key) => {
    onChange({ ...filter, value: key, search: filter.search });
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange({ search: "", value: "", status: filter.status });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-base-300 bg-base-100 sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none"
        />
        <input
          value={filter.search}
          onChange={(e) => {
            onChange({ ...filter, search: e.target.value });
            setShowSuggestions(!!e.target.value);
          }}
          onFocus={() => filter.search && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          type="text"
          placeholder="Search tournaments…"
          className="w-full h-9 pl-9 pr-8 rounded-xl bg-base-200/80 border border-base-content/8 focus:border-primary/40 focus:bg-base-100 focus:shadow-sm outline-none text-sm transition-all duration-200 placeholder:text-base-content/35"
        />
        {filter.search && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60 transition-colors"
          >
            <X size={13} />
          </button>
        )}
        {/* Suggestions */}
        {showSuggestions && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-base-100 border border-base-content/10 rounded-2xl shadow-xl overflow-hidden z-50">
            <p className="px-3 pt-2.5 pb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-base-content/30">
              Search by
            </p>
            {[
              { label: "Tournament", key: "tournamentName" },
              { label: "Organiser",  key: "organiserName" },
              { label: "City",       key: "city" },
              { label: "Ground",     key: "ground" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onMouseDown={() => handleSearchSelect(key)}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-base-200/70 transition-colors text-left group"
              >
                <Search size={12} className="text-base-content/30 shrink-0 group-hover:text-primary" />
                <span className="text-base-content/55 group-hover:text-base-content/80 truncate flex-1 text-xs">
                  {filter.search}
                </span>
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
          {STATUS_OPTIONS.map((s) => (
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

/* ─── Edit Modal ──────────────────────────────────────────────────── */
function EditModal({ tournament, onClose }) {
  const [form, setForm] = useState({
    tournamentName:      tournament.tournamentName ?? "",
    organiserName:       tournament.organiserName ?? "",
    phone:               tournament.phone ?? "",
    city:                tournament.city ?? "",
    ground:              tournament.ground ?? "",
    status:              tournament.status ?? "Upcoming",
    ballType:            tournament.ballType ?? "",
    pitchType:           tournament.pitchType ?? "",
    tournamentCategory:  tournament.tournamentCategory ?? "",
    startDate:           tournament.startDate?.slice(0, 10) ?? "",
    endDate:             tournament.endDate?.slice(0, 10) ?? "",
    additionalInfo:      tournament.additionalInfo ?? "",
  });

  const [updateTournament, { isLoading }] = useSuperAdminUpdateTournamentMutation();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTournament({
        tournamentId: tournament._id,
        updatedFields: form,
      }).unwrap();
      onClose();
    } catch {
      // toast handled inside tournamentApi
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Pencil className="text-white" size={15} />
            </div>
            <div>
              <h2 className="font-bold text-base-content text-sm">Edit Tournament</h2>
              <p className="text-xs text-base-content/40 truncate max-w-[200px]">
                {tournament.tournamentName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tournament Name */}
            <label className="form-control col-span-full">
              <span className="label-text text-xs font-medium mb-1">Tournament Name</span>
              <input
                value={form.tournamentName}
                onChange={set("tournamentName")}
                className="input input-sm input-bordered w-full"
                required
              />
            </label>

            {/* Organiser */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Organiser Name</span>
              <input
                value={form.organiserName}
                onChange={set("organiserName")}
                className="input input-sm input-bordered w-full"
              />
            </label>

            {/* Phone */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Phone</span>
              <input
                value={form.phone}
                onChange={set("phone")}
                pattern="[0-9]{10}"
                maxLength={10}
                className="input input-sm input-bordered w-full"
              />
            </label>

            {/* City */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">City</span>
              <input
                value={form.city}
                onChange={set("city")}
                className="input input-sm input-bordered w-full"
                required
              />
            </label>

            {/* Ground */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Ground</span>
              <input
                value={form.ground}
                onChange={set("ground")}
                className="input input-sm input-bordered w-full"
                required
              />
            </label>

            {/* Status */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Status</span>
              <select
                value={form.status}
                onChange={set("status")}
                className="select select-sm select-bordered w-full"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            {/* Ball Type */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Ball Type</span>
              <select
                value={form.ballType}
                onChange={set("ballType")}
                className="select select-sm select-bordered w-full"
                required
              >
                {["Bunat","Red Ball","Swing Ball","Tennis","Leather","Other"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>

            {/* Pitch Type */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Pitch Type</span>
              <select
                value={form.pitchType}
                onChange={set("pitchType")}
                className="select select-sm select-bordered w-full"
                required
              >
                {["Regular","Cement","Matte"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            {/* Category */}
            <label className="form-control col-span-full">
              <span className="label-text text-xs font-medium mb-1">Category</span>
              <select
                value={form.tournamentCategory}
                onChange={set("tournamentCategory")}
                className="select select-sm select-bordered w-full"
                required
              >
                {CATEGORIES.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>

            {/* Start Date */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Start Date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                className="input input-sm input-bordered w-full"
              />
            </label>

            {/* End Date */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">End Date</span>
              <input
                type="date"
                value={form.endDate}
                onChange={set("endDate")}
                className="input input-sm input-bordered w-full"
              />
            </label>

            {/* Additional Info */}
            <label className="form-control col-span-full">
              <span className="label-text text-xs font-medium mb-1">Additional Info</span>
              <textarea
                value={form.additionalInfo}
                onChange={set("additionalInfo")}
                rows={3}
                className="textarea textarea-bordered textarea-sm w-full resize-none"
              />
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-sm btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-sm btn-primary gap-2"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <CheckCircle2 size={14} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ────────────────────────────────────────── */
function DeleteModal({ tournament, onClose }) {
  const [deleteTournament, { isLoading }] = useSuperAdminDeleteTournamentMutation();

  const handleDelete = async () => {
    try {
      await deleteTournament(tournament._id).unwrap();
      onClose();
    } catch {
      // toast handled inside tournamentApi
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <div className="p-3 rounded-full bg-error/10">
            <AlertTriangle className="text-error" size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base-content">Delete Tournament</h2>
            <p className="text-xs text-base-content/50">This action cannot be undone.</p>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-sm text-base-content/70">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-base-content">
              {tournament.tournamentName}
            </span>
            ?{" "}
            <span className="text-error font-medium">All data for this tournament will be lost.</span>
          </p>
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="btn btn-sm btn-error gap-2"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tournament Card ─────────────────────────────────────────────── */
function TournamentCard({ tournament, onEdit, onDelete }) {
  return (
    <li className="flex flex-col rounded-xl bg-base-100 border border-base-content/10 hover:border-base-content/25 hover:shadow-lg transition-all duration-200">

      {/* ── Card header row: name + status badge + action buttons ── */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2">
        {/* Tournament name badge */}
        <h3 className="text-sm font-semibold capitalize tracking-tight badge badge-soft badge-info flex-1 min-w-0 truncate">
          {tournament.tournamentName}
        </h3>

        {/* Status + action buttons stacked on the right */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Status badge */}
          <span
            className={`badge badge-soft ${
              STATUS_COLOR[tournament.status] ?? "badge-neutral"
            } text-[.6rem] font-medium px-2`}
          >
            {tournament.status}
          </span>

          {/* Edit / Delete buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(tournament)}
              className="btn btn-xs btn-ghost text-base-content/50 hover:text-primary hover:bg-primary/10"
              title="Edit tournament"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => onDelete(tournament)}
              className="btn btn-xs btn-ghost text-base-content/50 hover:text-error hover:bg-error/10"
              title="Delete tournament"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Body details ── */}
      <div className="px-4 pb-3 flex flex-col gap-2">
        <div className="flex gap-2 text-[.7rem] text-base-content/50 items-center">
          <User size={12} />
          <span className="text-base-content/40">Organiser</span>
          <span className="font-medium text-base-content/70 truncate">
            {tournament.organiserName}
          </span>
        </div>

        <div className="flex gap-2 text-[.7rem] text-base-content/50 items-center">
          <Phone size={12} />
          <span className="text-base-content/40">Contact</span>
          <span className="font-medium text-base-content/70">{tournament.phone}</span>
        </div>

        <div className="flex justify-between text-[.7rem] text-base-content/50">
          <div className="flex gap-1 items-center">
            <Calendar size={11} />
            <span className="text-base-content/40">Start</span>
            <span className="font-medium text-base-content/70">
              {fmtDate(tournament.startDate)}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <Calendar size={11} />
            <span className="text-base-content/40">End</span>
            <span className="font-medium text-base-content/70">
              {fmtDate(tournament.endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-base-content/8 flex flex-col gap-1.5 rounded-b-xl px-4 py-2.5 text-[.7rem] bg-base-200/40 mt-auto">
        <div className="flex gap-1 text-base-content/40 items-center">
          <Info size={11} />
          <span>Created</span>
          <span className="text-base-content/60 font-medium">
            {fmtDate(tournament.createdAt)}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center text-base-content/50 font-medium">
            <MapPin size={11} />
            <span className="text-base-content/35">City</span>
            <span className="capitalize text-base-content/65">{tournament.city}</span>
          </div>
          <div className="flex gap-1 items-center text-base-content/50 font-medium">
            <Trophy size={11} />
            <span className="text-base-content/35">Ground</span>
            <span className="capitalize text-base-content/65">{tournament.ground}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export function AllTournamentListAdmin() {
  const [activeCategory, setActiveCategory] = useState("open");
  const [filter, setFilter] = useState({ search: "", value: "", status: "" });
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryArgs = useMemo(
    () => ({ tournamentCategory: activeCategory, searchData: filter }),
    [activeCategory, filter],
  );

  const { data, isLoading } = useGetAllTournamentsQuery(queryArgs);

  const noTournaments =
    !isLoading && (!data?.allTournaments || data.allTournaments.length === 0);

  return (
    <div className="flex flex-col min-h-0">
      {/* ── Category tab bar ── */}
      <div className="px-4 md:px-6 pt-5 pb-0">
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

      {/* ── Search + Filter ── */}
      <div className="mt-3">
        <SearchBar filter={filter} onChange={setFilter} />
      </div>

      {/* ── List ── */}
      <div className="px-4 md:px-6 py-4">
        {isLoading ? (
          <DummyCardLoadingSkelton />
        ) : noTournaments ? (
          <NoDataFoundPage
            image={noData}
            title="No Tournament Found"
            description="No tournaments match this category / filter."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.allTournaments.map((tournament) => (
              <TournamentCard
                key={tournament._id}
                tournament={tournament}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ── Modals ── */}
      {editTarget && (
        <EditModal tournament={editTarget} onClose={() => setEditTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteModal tournament={deleteTarget} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
