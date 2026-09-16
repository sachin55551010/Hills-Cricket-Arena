import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export const LocalMatchleaderBoardPage = () => {
  return (
    <div className="">
      <header className="fixed top-0 left-0 z-[1000] h-[var(--nav-h)] bg-base-100 flex items-center gap-2 px-2 w-dvw">
        <Link to="/local-match/scoring" relative="path">
          <ArrowLeft size={30} strokeWidth={4} />
        </Link>
        <h1 className="font-semibold">Scoring board</h1>
      </header>
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
          <NavLink
            to="local-match-summary"
            className={({ isActive }) =>
              `${
                isActive && "border-b-2 font-extrabold text-success"
              } text-center flex-1 pb-2`
            }
          >
            Match Summary
          </NavLink>
        </nav>
      </div>

      <Outlet />
    </div>
  );
};
