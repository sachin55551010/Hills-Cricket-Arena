import { useState, useEffect } from "react";
import {
  Activity,
  Trophy,
  Swords,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useGetAllDataInNumberQuery } from "../store/superAdminApi";
import { Header } from "../components/Header";
import { RecentActivities } from "./RecentActivities";
import { AllTournamentListAdmin } from "./AllTournamentListAdmin";
import { AllPlayersListAdmin } from "./AllPlayersListAdmin";
import { AllMatchListAdmin } from "./AllMatchListAdmin";

/* ─── menu items config ─────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "recent-activities", label: "Recent Activities", icon: Activity },
  { id: "tournaments", label: "Tournaments", icon: Trophy },
  { id: "matches", label: "Matches", icon: Swords },
  { id: "players", label: "Players", icon: Users },
];

/* ─── Sidebar ────────────────────────────────────────────────── */
function Sidebar({
  expanded,
  selected,
  onSelect,
  onToggle,
  isMobile,
  mobileOpen,
  onMobileClose,
}) {
  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 flex flex-col bg-base-200 border-r border-base-300 shadow-2xl
       transition-transform duration-300 ease-in-out w-64
       ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
    : `hidden md:flex flex-col bg-base-200 border-r border-base-300 shadow-lg
       transition-all duration-300 ease-in-out
       ${expanded ? "w-64" : "w-16"}`;

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={sidebarClasses} style={{ top: "var(--nav-h, 3rem)" }}>
        {/* Header */}
        <div
          className={`flex items-center border-b border-base-300 px-3 py-3 ${
            expanded || isMobile ? "justify-between" : "justify-center"
          }`}
        >
          {(expanded || isMobile) && (
            <div className="flex items-center gap-2">
              <Shield className="text-primary" size={20} />
              <span className="font-bold text-base-content text-sm tracking-wide">
                Super Admin
              </span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onToggle}
              className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronLeft size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}

          {isMobile && (
            <button
              onClick={onMobileClose}
              className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-error"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = selected === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onSelect(id);
                  if (isMobile) onMobileClose();
                }}
                title={!expanded && !isMobile ? label : undefined}
                className={`
                  w-full flex items-center gap-3 rounded-xl px-3 py-2.5
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
                  }
                  ${!expanded && !isMobile ? "justify-center" : ""}
                `}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                />

                {(expanded || isMobile) && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}

                {/* Tooltip when collapsed */}
                {!expanded && !isMobile && (
                  <span
                    className="
                    absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium
                    bg-base-300 text-base-content shadow-lg
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity duration-150 whitespace-nowrap z-50
                  "
                  >
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {(expanded || isMobile) && (
          <div className="px-3 py-3 border-t border-base-300">
            <p className="text-xs text-base-content/40 text-center">
              Hills Cricket Arena
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, count, gradient, isLoading }) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="card-body p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/50 font-medium mb-1 uppercase tracking-wide">
              {label}
            </p>
            {isLoading ? (
              <div className="skeleton h-9 w-20 rounded-lg" />
            ) : (
              <p className="text-3xl font-extrabold text-base-content tabular-nums">
                {count?.toLocaleString() ?? "—"}
              </p>
            )}
          </div>
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow`}
          >
            <Icon className="text-white" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Persistent stats bar (always visible) ─────────────────── */
function StatsBar() {
  const { data, isLoading, isError } = useGetAllDataInNumberQuery();

  const stats = [
    {
      icon: Trophy,
      label: "Total Tournaments",
      count: data?.data?.totalTournaments,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Shield,
      label: "Total Teams",
      count: data?.data?.totalTeams,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users,
      label: "Total Players",
      count: data?.data?.totalPlayers,
      gradient: "from-sky-500 to-blue-600",
    },
  ];

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 border-b border-base-300">
      {isError && (
        <div className="alert alert-error mb-4 shadow text-sm">
          <span>Failed to load stats. Please refresh.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
}

/* ─── Coming Soon placeholder ────────────────────────────────── */
function ComingSoon({ label, icon: Icon, gradient }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <div
        className={`p-5 rounded-3xl bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon className="text-white" size={36} />
      </div>
      <h2 className="text-xl font-bold text-base-content">{label}</h2>
      <p className="text-sm text-base-content/40 max-w-xs">
        This section is coming soon. Check back later.
      </p>
    </div>
  );
}

/* ─── Per-tab content (rendered below StatsBar) ─────────────── */
function TabContent({ selected }) {
  if (selected === "recent-activities") {
    return <RecentActivities />;
  }
  if (selected === "tournaments") return <AllTournamentListAdmin />;
  if (selected === "matches") return <AllMatchListAdmin />;
  if (selected === "players") return <AllPlayersListAdmin />;
  return null;
}

/* ─── SuperAdmin Page ────────────────────────────────────────── */
export const SuperAdmin = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("recent-activities");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Header data="Super Admin" backTo="/" />
      <div
        className="flex"
        style={{
          minHeight: "calc(100dvh - var(--nav-h, 3rem))",
          paddingTop: "var(--nav-h, 3rem)",
        }}
      >
        {/* Desktop sidebar */}
        <Sidebar
          expanded={expanded}
          selected={selected}
          onSelect={setSelected}
          onToggle={() => setExpanded((p) => !p)}
          isMobile={false}
          mobileOpen={false}
          onMobileClose={() => {}}
        />

        {/* Mobile drawer */}
        <Sidebar
          expanded={true}
          selected={selected}
          onSelect={setSelected}
          onToggle={() => {}}
          isMobile={true}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-200 sticky top-[var(--nav-h,3rem)] z-30">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(true)}
              className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-primary"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span className="font-bold text-sm text-base-content">
                Super Admin
              </span>
            </div>
            <div className="ml-auto">
              {(() => {
                const item = NAV_ITEMS.find((n) => n.id === selected);
                const Icon = item?.icon;
                return Icon ? (
                  <div className="badge badge-primary badge-outline gap-1 text-xs">
                    <Icon size={12} />
                    {item.label}
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto">
            {/* Stat cards — always visible on every tab */}
            <StatsBar />
            {/* Tab-specific content */}
            <TabContent selected={selected} />
          </div>
        </div>
      </div>
    </>
  );
};
