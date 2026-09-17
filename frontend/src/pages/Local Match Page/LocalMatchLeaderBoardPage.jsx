import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { generateMatchPDF } from "../../utils/generateMatchPDF";

export const LocalMatchleaderBoardPage = () => {
  const { currentMatchData } = useSelector((state) => state.score);

  return (
    <div className="">
      <header className="fixed top-0 left-0 z-[1000] h-[var(--nav-h)] bg-base-100 flex items-center gap-2 px-2 w-dvw">
        <Link to="/local-match/scoring" relative="path">
          <ArrowLeft size={30} strokeWidth={4} />
        </Link>
        <h1 className="font-semibold">Scoring board</h1>

        {/* PDF Download button in header */}
        <button
          id="header-download-pdf-btn"
          type="button"
          title="Download match scorecard as PDF"
          onClick={() => generateMatchPDF(currentMatchData)}
          disabled={!currentMatchData}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white active:scale-95 disabled:opacity-40"
        >
          <Download size={14} />
          PDF
        </button>
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
