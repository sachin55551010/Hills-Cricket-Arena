import { NavLink, Outlet } from "react-router-dom";

export const MatchInfoPage = () => {
  return (
    <div className="pt-12">
      <div className="flex text-sm pt-4 bg-base-200 fixed w-full z-50">
        <NavLink
          to="info"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-bold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Info
        </NavLink>

        <NavLink
          to="live"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-bold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Live
        </NavLink>

        <NavLink
          to="scorecard"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-bold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Score Card
        </NavLink>

        <NavLink
          to="squad"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-bold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Squad
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
};
