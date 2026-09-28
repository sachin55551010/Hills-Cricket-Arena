import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export const SearchInput = ({ onSearch }) => {
  const [filter, setFilter] = useState({
    search: "",
    value: "",
    status: "",
  });

  const handleSearchBtn = (key) => {
    const newFilter = { ...filter, value: key };
    onSearch(newFilter);
    setFilter({ ...newFilter, search: "" });
  };

  const handleClear = () => {
    const reset = { search: "", value: "", status: filter.status };
    setFilter(reset);
    onSearch(reset);
  };

  const handleStatusChange = (e) => {
    const newFilter = { ...filter, status: e.target.value };
    setFilter(newFilter);
    onSearch(newFilter);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      {/* ── Search bar ── */}
      <div className="flex-1 relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none"
        />

        <input
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          value={filter.search}
          type="text"
          className="w-full h-9 pl-9 pr-8 rounded-xl bg-base-200/80 border border-base-content/8 focus:border-primary/40 focus:bg-base-100 focus:shadow-sm outline-none text-sm transition-all duration-200 placeholder:text-base-content/35"
          placeholder="Search tournaments…"
        />

        {/* Clear button */}
        {filter.search && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60 transition-colors"
          >
            <X size={13} />
          </button>
        )}

        {/* Suggestions dropdown */}
        {filter.search && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-base-100 border border-base-content/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <p className="px-3 pt-2.5 pb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-base-content/30">
              Search by
            </p>
            {[
              { label: "Tournament", key: "tournamentName" },
              { label: "Organiser", key: "organiserName" },
              { label: "City", key: "city" },
              { label: "Ground", key: "ground" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => handleSearchBtn(key)}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-base-200/70 transition-colors text-left group"
              >
                <Search size={12} className="text-base-content/30 shrink-0 group-hover:text-primary transition-colors" />
                <span className="text-base-content/55 group-hover:text-base-content/80 transition-colors truncate flex-1 text-xs">
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

      {/* ── Status filter ── */}
      <div className="relative shrink-0">
        <select
          id="status-filter"
          value={filter.status}
          onChange={handleStatusChange}
          className="h-9 pl-3 pr-8 rounded-xl bg-base-200/80 border border-base-content/8 focus:border-primary/40 focus:bg-base-100 outline-none text-xs font-medium transition-all duration-200 appearance-none cursor-pointer text-base-content/70"
        >
          <option value="">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Inactive">Inactive</option>
          <option value="Abandoned">Abandoned</option>
          <option value="Postponed">Postponed</option>
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none"
        />
      </div>
    </div>
  );
};
