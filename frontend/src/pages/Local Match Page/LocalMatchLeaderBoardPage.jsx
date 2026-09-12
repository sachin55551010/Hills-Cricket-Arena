import { NavLink, Outlet } from "react-router-dom";

export const LocalMatchleaderBoardPage = () => {
  return (
    <div className="">
      <div className="flex flex-col fixed z-[70] w-full bg-base-100">
        <nav className="w-full bg-base-100 flex justify-around pt-18 text-[.8rem]">
          <NavLink
            to="scoreboard"
            className={({ isActive }) =>
              `${
                isActive && "border-b-2 font-extrabold text-success"
              } text-center flex-1 pb-2`
            }
          >
            Scoreboard
          </NavLink>
          <NavLink
            to="overs"
            className={({ isActive }) =>
              `${
                isActive && "border-b-2 font-extrabold text-success"
              } text-center flex-1 pb-2`
            }
          >
            Overs
          </NavLink>
        </nav>
      </div>

      <Outlet />
    </div>
  );
};
