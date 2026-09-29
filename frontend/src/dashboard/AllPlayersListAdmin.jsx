import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  Phone,
  User,
  BadgeCheck,
  ShieldCheck,
  Users,
  RefreshCw,
  Mail,
  Lock,
} from "lucide-react";
import {
  useGetAllPlayersQuery,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
  useUpdatePlayerStatsMutation,
} from "../store/superAdminApi";
import { defaultAvatar } from "../utils/noprofilePicHelper";

/* ─── constants ──────────────────────────────────────────────────── */
const PLAYING_ROLES = [
  "top order batsman",
  "middle order batsman",
  "opening batsman",
  "bowler",
  "all rounder",
  "wicket keeper batter",
  "lower order batsman",
  "none",
];

const BATTING_STYLES = ["right handed bat", "left handed bat"];

const BOWLING_STYLES = [
  "right arm fast", "right arm fast medium", "right arm medium",
  "right arm orthodox", "right arm chinaman", "right arm off break",
  "right arm leg break", "right arm slow",
  "left arm fast", "left arm fast medium", "left arm medium",
  "left arm orthodox", "left arm chinaman", "left arm off break",
  "left arm leg break", "left arm slow", "none",
];

const ROLE_OPTIONS = ["user", "organiser", "superadmin"];

const ROLE_BADGE = {
  superadmin: "badge-error",
  organiser:  "badge-warning",
  user:       "badge-info",
};

/* ─── helpers ──────────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function Avatar({ src, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-base-300 shrink-0"
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-sm shrink-0">
      {defaultAvatar(name)}
    </div>
  );
}

/* ─── SearchBar ──────────────────────────────────────────────────── */
function SearchBar({ filter, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-base-300 bg-base-100">
      {/* Search */}
      <div className="flex-1 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none" />
        <input
          value={filter.search}
          onChange={(e) => {
            onChange({ ...filter, search: e.target.value });
            setShowSuggestions(!!e.target.value);
          }}
          onFocus={() => filter.search && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          type="text"
          placeholder="Search players…"
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
        {showSuggestions && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-base-100 border border-base-content/10 rounded-2xl shadow-xl overflow-hidden z-50">
            <p className="px-3 pt-2.5 pb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-base-content/30">
              Search by
            </p>
            {[
              { label: "Name",   key: "playerName" },
              { label: "Phone",  key: "number" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onMouseDown={() => {
                  onChange({ ...filter, value: key });
                  setShowSuggestions(false);
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

      {/* Role filter */}
      <div className="relative shrink-0">
        <select
          value={filter.role}
          onChange={(e) => onChange({ ...filter, role: e.target.value })}
          className="h-9 pl-3 pr-8 rounded-xl bg-base-200/80 border border-base-content/8 focus:border-primary/40 outline-none text-xs font-medium appearance-none cursor-pointer text-base-content/70"
        >
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Edit Profile Modal ─────────────────────────────────────────── */
function EditPlayerModal({ player, onClose }) {
  const [form, setForm] = useState({
    // Player profile fields
    playerName:   player.playerName ?? "",
    number:       player.number ?? "",
    gender:       player.gender ?? "",
    dateOfBirth:  player.dateOfBirth?.slice(0, 10) ?? "",
    playingRole:  player.playingRole ?? "",
    battingStyle: player.battingStyle ?? "",
    bowlingStyle: player.bowlingStyle ?? "",
    role:         player.role ?? ["user"],
    isVarified:   player.isVarified ?? false,
    // Linked User account fields
    userName:     player.playerId?.name ?? "",
    userEmail:    player.playerId?.email ?? "",
  });

  const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRoleToggle = (r) => {
    setForm((f) => ({
      ...f,
      role: f.role.includes(r) ? f.role.filter((x) => x !== r) : [...f.role, r],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePlayer({ playerId: player._id, updatedFields: form }).unwrap();
      onClose();
    } catch { /* toast handled in API */ }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Pencil className="text-white" size={15} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Edit Player</h2>
              <p className="text-xs text-base-content/40 truncate max-w-[200px]">{player.playerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle"><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-5 flex-1">

          {/* ── Account Info section (linked User doc) ───────── */}
          {(form.userName || form.userEmail || player.playerId) && (
            <div className="rounded-xl border border-base-content/10 bg-base-200/40 p-4 space-y-3">
              <p className="text-[.65rem] font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                <Lock size={10} /> Account Info
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* User display name */}
                <label className="form-control">
                  <span className="label-text text-xs font-medium mb-1 flex items-center gap-1">
                    <User size={11} /> Account Name
                  </span>
                  <input
                    value={form.userName}
                    onChange={set("userName")}
                    placeholder="User's display name"
                    className="input input-sm input-bordered w-full"
                  />
                </label>

                {/* User email */}
                <label className="form-control">
                  <span className="label-text text-xs font-medium mb-1 flex items-center gap-1">
                    <Mail size={11} /> Account Email
                  </span>
                  <input
                    type="email"
                    value={form.userEmail}
                    onChange={set("userEmail")}
                    placeholder="user@email.com"
                    className="input input-sm input-bordered w-full"
                  />
                </label>
              </div>
              <p className="text-[.65rem] text-base-content/35">
                ⚠️ Changing email may affect login if the user uses email/password auth.
              </p>
            </div>
          )}

          {/* ── Player Profile fields ─────────────────────────── */}
          <div className="rounded-xl border border-base-content/10 bg-base-200/40 p-4">
            <p className="text-[.65rem] font-bold uppercase tracking-widest text-base-content/40 mb-3 flex items-center gap-1.5">
              <User size={10} /> Player Profile
            </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <label className="form-control col-span-full">
              <span className="label-text text-xs font-medium mb-1">Player Name</span>
              <input value={form.playerName} onChange={set("playerName")} className="input input-sm input-bordered w-full" required />
            </label>

            {/* Phone */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Phone Number</span>
              <input value={form.number} onChange={set("number")} maxLength={10} pattern="[0-9]{10}" className="input input-sm input-bordered w-full" placeholder="10 digits" />
            </label>

            {/* Gender */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Gender</span>
              <select value={form.gender} onChange={set("gender")} className="select select-sm select-bordered w-full">
                <option value="">Select</option>
                {["male", "female", "other"].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>

            {/* DOB */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Date of Birth</span>
              <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} className="input input-sm input-bordered w-full" />
            </label>

            {/* Playing Role */}
            <label className="form-control col-span-full">
              <span className="label-text text-xs font-medium mb-1">Playing Role</span>
              <select value={form.playingRole} onChange={set("playingRole")} className="select select-sm select-bordered w-full">
                <option value="">Select</option>
                {PLAYING_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>

            {/* Batting Style */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Batting Style</span>
              <select value={form.battingStyle} onChange={set("battingStyle")} className="select select-sm select-bordered w-full">
                <option value="">Select</option>
                {BATTING_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            {/* Bowling Style */}
            <label className="form-control">
              <span className="label-text text-xs font-medium mb-1">Bowling Style</span>
              <select value={form.bowlingStyle} onChange={set("bowlingStyle")} className="select select-sm select-bordered w-full">
                <option value="">Select</option>
                {BOWLING_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            {/* Roles */}
            <label className="form-control col-span-full">
              <span className="label-text text-xs font-medium mb-2">System Roles</span>
              <div className="flex gap-2 flex-wrap">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleToggle(r)}
                    className={`btn btn-xs rounded-full capitalize transition-all ${
                      form.role.includes(r) ? "btn-primary" : "btn-ghost border border-base-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </label>

            {/* Verified */}
            <label className="form-control col-span-full flex-row items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isVarified}
                onChange={(e) => setForm((f) => ({ ...f, isVarified: e.target.checked }))}
                className="checkbox checkbox-sm checkbox-success"
              />
              <span className="label-text text-xs font-medium">Mark as Verified</span>
            </label>
          </div>
          </div>{/* close Player Profile card */}

          <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-sm btn-ghost">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn btn-sm btn-primary gap-2">
              {isLoading ? <span className="loading loading-spinner loading-xs" /> : <CheckCircle2 size={14} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Stats Modal ───────────────────────────────────────────────── */
function StatsModal({ player, onClose }) {
  const cs = player.careerStats ?? {};
  const [form, setForm] = useState({
    matches: cs.matches ?? 0,
    batting: {
      innings:      cs.batting?.innings ?? 0,
      runs:         cs.batting?.runs ?? 0,
      ballsFaced:   cs.batting?.ballsFaced ?? 0,
      notOuts:      cs.batting?.notOuts ?? 0,
      ducks:        cs.batting?.ducks ?? 0,
      fours:        cs.batting?.fours ?? 0,
      sixes:        cs.batting?.sixes ?? 0,
      thirties:     cs.batting?.thirties ?? 0,
      fifties:      cs.batting?.fifties ?? 0,
      hundreds:     cs.batting?.hundreds ?? 0,
      highestScore: cs.batting?.highestScore ?? 0,
      average:      cs.batting?.average ?? 0,
      strikeRate:   cs.batting?.strikeRate ?? 0,
    },
    bowling: {
      innings:       cs.bowling?.innings ?? 0,
      balls:         cs.bowling?.balls ?? 0,
      runsConceded:  cs.bowling?.runsConceded ?? 0,
      wickets:       cs.bowling?.wickets ?? 0,
      threes:        cs.bowling?.threes ?? 0,
      fours:         cs.bowling?.fours ?? 0,
      five:          cs.bowling?.five ?? 0,
      bestBowling:   cs.bowling?.bestBowling ?? 0,
      average:       cs.bowling?.average ?? 0,
      economy:       cs.bowling?.economy ?? 0,
      strikeRate:    cs.bowling?.strikeRate ?? 0,
    },
  });

  const [updateStats, { isLoading }] = useUpdatePlayerStatsMutation();

  const setNum = (section, field) => (e) => {
    const val = parseFloat(e.target.value) || 0;
    if (section) {
      setForm((f) => ({ ...f, [section]: { ...f[section], [field]: val } }));
    } else {
      setForm((f) => ({ ...f, [field]: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStats({ playerId: player._id, careerStats: form }).unwrap();
      onClose();
    } catch { /* toast handled */ }
  };

  const Field = ({ label, section, field }) => (
    <label className="form-control">
      <span className="label-text text-xs font-medium mb-1">{label}</span>
      <input
        type="number"
        min={0}
        step="0.01"
        value={section ? form[section][field] : form[field]}
        onChange={setNum(section, field)}
        className="input input-xs input-bordered w-full"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <BarChart2 className="text-white" size={15} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Update Career Stats</h2>
              <p className="text-xs text-base-content/40 truncate max-w-[200px]">{player.playerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle"><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 flex-1 space-y-5">
          {/* Matches */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total Matches" section={null} field="matches" />
          </div>

          {/* Batting */}
          <div>
            <h3 className="text-xs font-bold text-base-content/60 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="h-px flex-1 bg-base-300" />
              🏏 Batting
              <span className="h-px flex-1 bg-base-300" />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Innings"       section="batting" field="innings" />
              <Field label="Runs"          section="batting" field="runs" />
              <Field label="Balls Faced"   section="batting" field="ballsFaced" />
              <Field label="Not Outs"      section="batting" field="notOuts" />
              <Field label="Ducks"         section="batting" field="ducks" />
              <Field label="Fours"         section="batting" field="fours" />
              <Field label="Sixes"         section="batting" field="sixes" />
              <Field label="30s"           section="batting" field="thirties" />
              <Field label="50s"           section="batting" field="fifties" />
              <Field label="100s"          section="batting" field="hundreds" />
              <Field label="Highest Score" section="batting" field="highestScore" />
              <Field label="Average"       section="batting" field="average" />
              <Field label="Strike Rate"   section="batting" field="strikeRate" />
            </div>
          </div>

          {/* Bowling */}
          <div>
            <h3 className="text-xs font-bold text-base-content/60 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="h-px flex-1 bg-base-300" />
              🎳 Bowling
              <span className="h-px flex-1 bg-base-300" />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Innings"       section="bowling" field="innings" />
              <Field label="Balls"         section="bowling" field="balls" />
              <Field label="Runs Conceded" section="bowling" field="runsConceded" />
              <Field label="Wickets"       section="bowling" field="wickets" />
              <Field label="3-Wickets"     section="bowling" field="threes" />
              <Field label="4-Wickets"     section="bowling" field="fours" />
              <Field label="5-Wickets"     section="bowling" field="five" />
              <Field label="Best Bowling"  section="bowling" field="bestBowling" />
              <Field label="Average"       section="bowling" field="average" />
              <Field label="Economy"       section="bowling" field="economy" />
              <Field label="Strike Rate"   section="bowling" field="strikeRate" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-sm btn-ghost">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn btn-sm btn-success gap-2">
              {isLoading ? <span className="loading loading-spinner loading-xs" /> : <CheckCircle2 size={14} />}
              Update Stats
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────────── */
function DeletePlayerModal({ player, onClose }) {
  const [deletePlayer, { isLoading }] = useDeletePlayerMutation();

  const handleDelete = async () => {
    try {
      await deletePlayer(player._id).unwrap();
      onClose();
    } catch { /* toast handled */ }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <div className="p-3 rounded-full bg-error/10">
            <AlertTriangle className="text-error" size={22} />
          </div>
          <div>
            <h2 className="font-bold text-base-content">Delete Player</h2>
            <p className="text-xs text-base-content/50">This action cannot be undone.</p>
          </div>
        </div>

        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200 mb-3">
            <Avatar src={player.profilePicture} name={player.playerName} />
            <div>
              <p className="font-semibold text-sm">{player.playerName}</p>
              <p className="text-xs text-base-content/50">{player.number || "No phone"}</p>
            </div>
          </div>
          <p className="text-sm text-base-content/70">
            Permanently delete this player?{" "}
            <span className="text-error font-medium">All data will be lost.</span>
          </p>
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="btn btn-sm btn-ghost">Cancel</button>
          <button onClick={handleDelete} disabled={isLoading} className="btn btn-sm btn-error gap-2">
            {isLoading ? <span className="loading loading-spinner loading-xs" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Player Row Card ───────────────────────────────────────────── */
function PlayerRow({ player, onEdit, onDelete, onStats }) {
  const navigate = useNavigate();

  return (
    <li
      onClick={() => navigate(`/profile/${player._id}`)}
      className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/10 hover:border-primary/30 hover:shadow-sm hover:bg-base-200/40 transition-all duration-200 cursor-pointer group"
    >
      {/* Avatar */}
      <Avatar src={player.profilePicture} name={player.playerName} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-base-content truncate capitalize">
            {player.playerName}
          </p>
          {player.isVarified && (
            <BadgeCheck size={14} className="text-success shrink-0" title="Verified" />
          )}
          {player.role?.map((r) => (
            <span key={r} className={`badge badge-xs badge-soft ${ROLE_BADGE[r] ?? "badge-ghost"} shrink-0`}>
              {r}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
          {player.number && (
            <span className="flex items-center gap-1 text-xs text-base-content/50">
              <Phone size={10} />{player.number}
            </span>
          )}
          {player.playerId?.email && (
            <span className="flex items-center gap-1 text-xs text-base-content/50 truncate max-w-[160px]">
              <Mail size={10} />{player.playerId.email}
            </span>
          )}
          {!player.playerId?.email && player.gender && (
            <span className="flex items-center gap-1 text-xs text-base-content/50">
              <User size={10} className="capitalize" />{player.gender}
            </span>
          )}
          {player.playingRole && (
            <span className="text-xs text-base-content/40 capitalize truncate">
              {player.playingRole}
            </span>
          )}
        </div>

        <p className="text-[10px] text-base-content/30 mt-0.5">
          Joined {timeAgo(player.createdAt)} · {player.careerStats?.matches ?? 0} matches
        </p>
      </div>

      {/* Actions — stop propagation so row click doesn't fire */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onStats(player)}
          className="btn btn-xs btn-ghost text-base-content/40 hover:text-success hover:bg-success/10"
          title="Update stats"
        >
          <BarChart2 size={13} />
        </button>
        <button
          onClick={() => onEdit(player)}
          className="btn btn-xs btn-ghost text-base-content/40 hover:text-primary hover:bg-primary/10"
          title="Edit player"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(player)}
          className="btn btn-xs btn-ghost text-base-content/40 hover:text-error hover:bg-error/10"
          title="Delete player"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </li>
  );
}

/* ─── Skeleton loader ───────────────────────────────────────────── */
function SkeletonList() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-content/10 animate-pulse">
          <div className="skeleton w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-2 w-48 rounded" />
          </div>
          <div className="skeleton h-6 w-20 rounded" />
        </li>
      ))}
    </ul>
  );
}

/* ─── Main Export ───────────────────────────────────────────────── */
export function AllPlayersListAdmin() {
  const [filter, setFilter] = useState({ search: "", value: "", role: "" });
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statsTarget,  setStatsTarget]  = useState(null);

  const queryArgs = useMemo(
    () => ({ search: filter.search, value: filter.value, role: filter.role }),
    [filter],
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllPlayersQuery(queryArgs);

  const players = data?.players ?? [];

  return (
    <div className="flex flex-col min-h-0">
      {/* ── Header ── */}
      <div className="px-4 md:px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-md">
            <Users className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-content">All Players</h1>
            <p className="text-xs text-base-content/50">
              {isLoading ? "Loading…" : `${players.length} player${players.length !== 1 ? "s" : ""} found`}
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

      {/* ── Search + Filter ── */}
      <SearchBar filter={filter} onChange={setFilter} />

      {/* ── Player list ── */}
      <div className="px-4 md:px-6 py-4 flex-1 overflow-y-auto">
        {isError && (
          <div className="alert alert-error mb-4 text-sm gap-2">
            <AlertTriangle size={15} />
            <span>Failed to load players.</span>
            <button onClick={refetch} className="btn btn-xs btn-ghost ml-auto">Retry</button>
          </div>
        )}

        {isLoading ? (
          <SkeletonList />
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-base-content/40 gap-3">
            <ShieldCheck size={40} className="opacity-30" />
            <p className="text-sm">No players match your search.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {players.map((player) => (
              <PlayerRow
                key={player._id}
                player={player}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onStats={setStatsTarget}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ── Modals ── */}
      {editTarget   && <EditPlayerModal   player={editTarget}   onClose={() => setEditTarget(null)}   />}
      {deleteTarget && <DeletePlayerModal player={deleteTarget} onClose={() => setDeleteTarget(null)} />}
      {statsTarget  && <StatsModal        player={statsTarget}  onClose={() => setStatsTarget(null)}  />}
    </div>
  );
}
