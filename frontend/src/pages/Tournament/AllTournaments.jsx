import { NavLink, Outlet } from "react-router-dom";
import { SearchInput } from "../../components/SearchInput";
import { useState } from "react";

export const AllTournaments = () => {
  const [searchData, setSearchData] = useState({
    search: "",
    value: "",
    status: "",
  });

  // Child sets this to false when data is loaded and empty
  const [hasTournaments, setHasTournaments] = useState(true);

  return (
    <div>
      <div className="flex flex-col fixed z-[70] w-full bg-base-100">
        {/* ── Category tab bar ── */}
        <nav className="w-full bg-base-100 flex justify-around pt-18 text-[.8rem]">
          {[
            { to: "open", label: "Open" },
            { to: "panchayat", label: "Panchayat" },
            { to: "panchayat+open", label: "P + O" },
            { to: "corporate", label: "Corporate" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${
                  isActive && "border-b-2 border-success font-extrabold text-success"
                } text-center flex-1 pb-2 transition-colors duration-150`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Search + Filter — hidden when no tournaments ── */}
        {hasTournaments && <SearchInput onSearch={setSearchData} />}
      </div>

      <Outlet context={{ searchData, setHasTournaments }} />
    </div>
  );
};
