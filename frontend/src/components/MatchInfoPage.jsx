import { NavLink, Outlet } from "react-router-dom";

export const MatchInfoPage = () => {
  return (
    <div className="pt-15">
      <div className="flex">
        <NavLink
          to="info"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Info
        </NavLink>

        <NavLink
          to="live"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Live
        </NavLink>

        <NavLink
          to="scorecard"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Score Card
        </NavLink>

        <NavLink
          to="squad"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
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
