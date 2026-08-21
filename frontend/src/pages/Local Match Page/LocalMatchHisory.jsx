import { Header } from "../../components/Header";
import noData from "../../../assets/No data-amico.svg";
import { NoDataFoundPage } from "../../components/NoDataFoundPage";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { DeleteMatchHistoryModal } from "../../components/modals/DeleteMatchHistoryModal";
export const LocalMatchHisory = () => {
  const matchList = JSON.parse(localStorage.getItem("matchHistory")) || [];
  console.log(matchList);

  const [deleteMatchModal, setDeleteMatchModal] = useState(false);
  const [matchId, setmatchId] = useState("");
  const handleDeleteBtn = (id) => {
    setmatchId(id);
    setDeleteMatchModal(true);
  };
  return (
    <div className="pt-12 h-dvh w-screen flex justify-center">
      <Header data="Match History" />

      <div className="w-full lg:w-[60%]">
        {matchList.length === 0 ? (
          <div className="pt-10 w-auto flex flex-col items-center justify-center">
            <NoDataFoundPage
              image={noData}
              title="No match found"
              description="There are no match available right now."
            />
          </div>
        ) : (
          <ul className="p-4 flex flex-col gap-4">
            {matchList.map((match) => {
              return (
                <li
                  key={match.matchId}
                  className="border flex flex-col gap-3 p-2 rounded-md border-base-content/15"
                >
                  {/* time */}
                  <div className="text-[.8rem]">
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
                  </div>

                  {/*first team name and score */}
                  <div className="flex items-center justify-between">
                    {/* first team name and photo */}
                    <div className="flex items-center gap-2">
                      {/* photo */}
                      <div className="border border-base-content/15 h-8 w-8 rounded-full flex items-center justify-center text-sm">
                        {defaultAvatar(match.firstTeam.name)}
                      </div>
                      {/* name  */}
                      <h6 className="text-sm font-semibold">
                        {match.firstTeam.name}
                      </h6>
                    </div>
                    {/*first team score */}
                    <div className="flex gap-2">
                      <div className="flex font-semibold">
                        <h6>{match.innings[0].runs}</h6>
                        <span>/</span>
                        <p>{match.innings[0].wickets}</p>
                      </div>
                      <div>
                        {Math.floor((match?.innings?.[0]?.legalBalls ?? 0) / 6)}
                        .{(match?.innings?.[0]?.legalBalls ?? 0) % 6}
                      </div>
                    </div>
                  </div>

                  {/* second team name and score */}
                  <div className="flex items-center justify-between">
                    {/* first team name and photo */}
                    <div className="flex items-center gap-2">
                      {/* photo */}
                      <div className="border border-base-content/15 h-8 w-8 rounded-full flex items-center justify-center text-sm">
                        {defaultAvatar(match.secondTeam.name)}
                      </div>
                      {/* name  */}
                      <h6 className="text-sm font-semibold">
                        {match.secondTeam.name}
                      </h6>
                    </div>
                    {/*first team score */}
                    <div className="flex gap-2 ">
                      <div className="flex font-semibold">
                        <h6>{match.innings[0].runs}</h6>
                        <span>/</span>
                        <p>{match.innings[0].wickets}</p>
                      </div>
                      <div>
                        {Math.floor((match?.innings?.[0]?.legalBalls ?? 0) / 6)}
                        .{(match?.innings?.[0]?.legalBalls ?? 0) % 6}
                      </div>
                    </div>
                  </div>

                  <p className="capitalize text-[.8rem] text-base-content/70">{`${match.toss.winner.name} won the toss and choose to ${match.toss.decision} first.`}</p>

                  <div
                    onClick={() => handleDeleteBtn(match.matchId)}
                    className="flex justify-end cursor-pointer"
                  >
                    <MdDelete size={18} />
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
