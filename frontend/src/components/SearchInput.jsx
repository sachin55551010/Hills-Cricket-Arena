import { useState } from "react";

export const SearchInput = ({ onSearch }) => {
  const [filter, setFilter] = useState({
    search: "",
    value: "",
    status: "",
  });
  console.log("filter", filter);

  const handleSearchBtn = (value) => {
    const newFilter = { ...filter, value };
    setFilter(newFilter);
    onSearch(newFilter);
    setFilter((prev) => ({ ...prev, search: "" }));
  };

  const handleOnChange = (e) => {
    const newFilter = { ...filter, status: e.target.value };
    setFilter(newFilter);
    onSearch(newFilter);
  };
  return (
    <div className="flex items-center justify-between px-4 py-2 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            value={filter.search}
            type="text"
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-base-200 border border-transparent focus:border-base-content/20 focus:bg-base-100 outline-none text-sm transition-all duration-200 placeholder:text-base-content/40"
            placeholder="Search tournaments..."
          />
        </div>

        {/* Dropdown */}
        {filter.search && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-base-100 border border-base-content/10 rounded-xl shadow-lg overflow-hidden z-50">
            {[
              { label: "Organiser", key: "organiserName" },
              { label: "Tournament", key: "tournamentName" },
              { label: "Ground", key: "ground" },
              { label: "City", key: "city" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => handleSearchBtn(key)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-base-200 transition-colors text-left group"
              >
                <span className="text-base-content/50 group-hover:text-base-content/70 transition-colors truncate flex-1">
                  {filter.search}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="shrink-0">
        <select
          id="status"
          className="h-9 px-3 pr-8 rounded-xl bg-base-200 border border-transparent focus:border-base-content/20 focus:bg-base-100 outline-none text-sm transition-all duration-200 appearance-none cursor-pointer"
          onChange={handleOnChange}
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
      </div>
    </div>
  );
};
