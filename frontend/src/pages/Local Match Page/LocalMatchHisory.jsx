import { Header } from "../../components/Header";
import noData from "../../../assets/No data-amico.svg";
import { NoDataFoundPage } from "../../components/NoDataFoundPage";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { DeleteMatchHistoryModal } from "../../components/modals/DeleteMatchHistoryModal";
import { useNavigate } from "react-router-dom";

export const LocalMatchHisory = () => {
  const matchList = JSON.parse(localStorage.getItem("matchHistory")) || [];

  const navigate = useNavigate();

  const [deleteMatchModal, setDeleteMatchModal] = useState(false);
  const [matchId, setmatchId] = useState("");
  const handleDeleteBtn = (id) => {
    setmatchId(id);
    setDeleteMatchModal(true);
  };

  const handleResumeBtn = (id) => {
    const match = matchList.find((match) => match.matchId === id);

    localStorage.setItem("currentMatch", JSON.stringify(match));
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
                    {/* First Team */}
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
                          {defaultAvatar(match.firstTeam.name)}
                        </div>

                        <h6 className="truncate text-sm font-semibold">
                          {match.firstTeam.name}
                        </h6>
                      </div>

                      <div className="ml-3 flex shrink-0 items-baseline gap-2">
                        <div className="flex items-baseline font-bold">
                          <span className="text-lg">
                            {match.innings[0].runs}
                          </span>

                          <span className="mx-0.5 text-base-content/40">/</span>

                          <span className="text-sm text-base-content/70">
                            {match.innings[0].wickets}
                          </span>
                        </div>

                        <span className="text-xs text-base-content/50">
                          {Math.floor(
                            (match?.innings?.[0]?.legalBalls ?? 0) / 6,
                          )}
                          .{(match?.innings?.[0]?.legalBalls ?? 0) % 6}
                        </span>
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="my-2 flex items-center gap-3">
                      <div className="h-px flex-1 bg-base-content/10" />
                      <span className="text-[9px] font-semibold tracking-wider text-base-content/30">
                        VS
                      </span>
                      <div className="h-px flex-1 bg-base-content/10" />
                    </div>

                    {/* Second Team */}
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
                          {defaultAvatar(match.secondTeam.name)}
                        </div>

                        <h6 className="truncate text-sm font-semibold">
                          {match.secondTeam.name}
                        </h6>
                      </div>

                      <div className="ml-3 flex shrink-0 items-baseline gap-2">
                        <div className="flex items-baseline font-bold">
                          <span className="text-lg">
                            {match.innings[0].runs}
                          </span>

                          <span className="mx-0.5 text-base-content/40">/</span>

                          <span className="text-sm text-base-content/70">
                            {match.innings[0].wickets}
                          </span>
                        </div>

                        <span className="text-xs text-base-content/50">
                          {Math.floor(
                            (match?.innings?.[0]?.legalBalls ?? 0) / 6,
                          )}
                          .{(match?.innings?.[0]?.legalBalls ?? 0) % 6}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toss */}
                  <div className="border-t border-base-content/10 px-4 py-3">
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
                  </div>

                  {/* Resume */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleResumeBtn(match.matchId)}
                      className="
                      btn btn-info
                      h-10 min-h-10 w-full
                      rounded-xl
                      text-sm font-semibold
                      shadow-none
                    "
                    >
                      Resume Match
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
