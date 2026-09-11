import { Header } from "../../components/Header";
import noData from "../../../assets/No data-amico.svg";
import { NoDataFoundPage } from "../../components/NoDataFoundPage";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { DeleteMatchHistoryModal } from "../../components/modals/DeleteMatchHistoryModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentMatchData } from "../../store/scoreSlice";

const formatOvers = (legalBalls = 0) =>
  `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

const getTeamInning = (match, teamId) =>
  match?.innings?.find((inning) => inning.battingTeamId === teamId) ?? null;

const TeamScoreRow = ({ teamName, inning }) => (
  <div className="flex items-center justify-between">
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-full
          bg-base-content/5
          text-sm font-semibold
        "
      >
        {defaultAvatar(teamName)}
      </div>

      <h6 className="truncate text-sm font-semibold">{teamName}</h6>
    </div>

    <div className="ml-3 flex shrink-0 items-baseline gap-2">
      {inning ? (
        <>
          <div className="flex items-baseline font-bold">
            <span className="text-lg">{inning.runs ?? 0}</span>
            <span className="mx-0.5 text-base-content/40">/</span>
            <span className="text-sm text-base-content/70">
              {inning.wickets ?? 0}
            </span>
          </div>
          <span className="text-xs text-base-content/50">
            {formatOvers(inning.legalBalls ?? 0)}
          </span>
        </>
      ) : (
        <span className="text-xs font-medium text-base-content/40">
          Yet to bat
        </span>
      )}
    </div>
  </div>
);

export const LocalMatchHisory = () => {
  const matchList = JSON.parse(localStorage.getItem("matchHistory")) || [];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteMatchModal, setDeleteMatchModal] = useState(false);
  const [matchId, setmatchId] = useState("");
  const handleDeleteBtn = (id) => {
    setmatchId(id);
    setDeleteMatchModal(true);
  };

  const handleResumeBtn = (id) => {
    const match = matchList.find((item) => item.matchId === id);
    if (!match || match.matchStatus === "completed") return;

    localStorage.setItem("currentMatch", JSON.stringify(match));
    dispatch(setCurrentMatchData(match));
    navigate("/local-match/scoring");
  };

  return (
    <div className="min-h-dvh w-full bg-base-100 pt-14">
      <Header data="Match History" />

      <div className="mx-auto w-full max-w-2xl">
        {matchList.length === 0 ? (
          <div className="flex w-full justify-center px-4 pt-10">
            <NoDataFoundPage
              image={noData}
              title="No match found"
              description="There are no match available right now."
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-3 px-3 py-4">
            {matchList.map((match) => {
              const isCompleted = match.matchStatus === "completed";
              const firstTeamInning = getTeamInning(
                match,
                match.firstTeam?.teamId,
              );
              const secondTeamInning = getTeamInning(
                match,
                match.secondTeam?.teamId,
              );

              return (
                <li
                  key={match.matchId}
                  className="
                  overflow-hidden
                  rounded-2xl
                  border border-base-content/10
                  bg-base-100
                  shadow-sm
                  transition-all
                  active:scale-[0.99]
                "
                >
                  {/* Date + Delete */}
                  <div className="flex items-center justify-between px-4 pt-3">
                    <span className="text-[11px] font-medium text-base-content/50">
                      {new Date(match.createdAt)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(",", " -")}
                    </span>

                    <button
                      onClick={() => handleDeleteBtn(match.matchId)}
                      className="
                      flex h-8 w-8 items-center justify-center
                      rounded-full
                      text-base-content/50
                      transition
                      hover:bg-error/10
                      hover:text-error
                      active:scale-90
                    "
                    >
                      <MdDelete size={17} />
                    </button>
                  </div>

                  {/* Teams + Scores */}
                  <div className="px-4 py-4">
                    <TeamScoreRow
                      teamName={match.firstTeam.name}
                      inning={firstTeamInning}
                    />

                    <div className="my-2 flex items-center gap-3">
                      <div className="h-px flex-1 bg-base-content/10" />
                      <span className="text-[9px] font-semibold tracking-wider text-base-content/30">
                        VS
                      </span>
                      <div className="h-px flex-1 bg-base-content/10" />
                    </div>

                    <TeamScoreRow
                      teamName={match.secondTeam.name}
                      inning={secondTeamInning}
                    />
                  </div>

                  <div className="border-t border-base-content/10 px-4 py-3">
                    {isCompleted && match.matchResult ? (
                      <p className="text-[11px] font-semibold leading-relaxed text-primary">
                        {match.matchResult}
                      </p>
                    ) : (
                      <p className="text-[11px] leading-relaxed text-base-content/55">
                        <span className="font-medium text-base-content/70">
                          {match.toss.winner.name}
                        </span>{" "}
                        won the toss and chose to{" "}
                        <span className="font-medium text-base-content/70">
                          {match.toss.decision}
                        </span>{" "}
                        first.
                      </p>
                    )}
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleResumeBtn(match.matchId)}
                      disabled={isCompleted}
                      className="
                      btn btn-info
                      h-10 min-h-10 w-full
                      rounded-xl
                      text-sm font-semibold
                      shadow-none
                      disabled:pointer-events-none
                      disabled:opacity-50
                    "
                    >
                      {isCompleted ? "Match Completed" : "Resume Match"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {deleteMatchModal && (
        <DeleteMatchHistoryModal
          onClose={() => setDeleteMatchModal(false)}
          matchId={matchId}
          matchList={matchList}
        />
      )}
    </div>
  );
};
