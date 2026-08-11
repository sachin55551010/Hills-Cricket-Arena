import { NavLink, Outlet } from "react-router-dom";

export const UserDashBoard = () => {
  return (
    <div>
      <nav className="dock z-100 dock-sm text-[.7rem] shadow-[10px_0px_10px_rgba(0,0,0,.5)]">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${
              isActive
                ? "badge badge-soft badge-success rounded-2xl font-semibold hover:rounded-2xl text-[.8rem]"
                : "hover:rounded-2xl hover:bg-base-content/40"
            }  h-10 rounded-2xl`
          }
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive
                ? "badge badge-soft badge-success rounded-2xl font-semibold text-[.8rem] hover:rounded-2xl"
                : "hover:rounded-2xl hover:bg-base-content/40"
            } h-10 rounded-2xl`
          }
          to="all-tournaments"
        >
          Tournaments
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive
                ? "badge badge-soft badge-success rounded-2xl font-semibold text-[.8rem] hover:rounded-2xl"
                : "hover:rounded-2xl hover:bg-base-content/40"
            } h-10 rounded-2xl`
          }
          to="all-matches"
        >
          Matches
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};
