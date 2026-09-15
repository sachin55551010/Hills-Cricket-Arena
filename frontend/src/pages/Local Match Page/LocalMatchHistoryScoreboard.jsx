import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LocalMatchScoreboard } from "./LocalMatchScoreboard";
import { LocalMatchOvers } from "./LocalMatchOvers";

const getMatchFromHistory = (matchId) => {
  try {
    const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
    return history.find((match) => match.matchId === matchId) || null;
  } catch (error) {
    console.error("Invalid matchHistory in localStorage:", error);
    return null;
  }
};

export const LocalMatchHistoryScoreboard = () => {
  const { matchId } = useParams();
  const match = getMatchFromHistory(matchId);
  const [activeTab, setActiveTab] = useState("scoreboard");

  const tabs = [
    { id: "scoreboard", label: "Scoreboard" },
    { id: "overs", label: "Overs" },
  ];

  return (
    <div className="min-h-dvh w-full bg-base-100 pt-12">
      <header className="fixed top-0 left-0 z-[1000] flex h-[var(--nav-h)] w-dvw items-center gap-2 bg-base-100 px-2">
        <Link
          to="/local-match/local-match-history"
          aria-label="Back to match history"
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-base-content/10"
        >
          <ArrowLeft size={26} strokeWidth={3} />
        </Link>

        <h1 className="font-semibold">Scoreboard</h1>
      </header>

      {match ? (
        <>
          <nav className="fixed left-0 top-[var(--nav-h)] z-[999] flex w-dvw justify-around border-b border-base-content/10 bg-base-100 text-[.8rem]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 pb-2 pt-3 text-center transition ${
                    isActive
                      ? "border-b-2 border-success font-extrabold text-success"
                      : "text-base-content/60"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-8">
            {activeTab === "scoreboard" ? (
              <LocalMatchScoreboard
                matchData={match}
                readOnly
                showBackLink={false}
              />
            ) : (
              <LocalMatchOvers matchData={match} showBackLink={false} />
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-base-content/50">
          No match data available.
        </div>
      )}
    </div>
  );
};
