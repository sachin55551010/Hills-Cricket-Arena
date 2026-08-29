import { Header } from "../../components/Header";
import noData from "../../../assets/No data-amico.svg";
import { NoDataFoundPage } from "../../components/NoDataFoundPage";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { LocalTeamNameUpdateModal } from "../../components/modals/LocalTeamNameUpdateModal";
import { LocalTeamDeleteModal } from "../../components/modals/LocalTeamDeleteModal";
import { useNavigate } from "react-router-dom";
import { AddLocalTeamModal } from "../../components/modals/AddLocalTeamModal";
export const LocalTeamList = () => {
  const [openEditNameModal, setOpenEditNameModal] = useState(false);
  const [openDeleteTeamModal, setOpenDeleteTeamModal] = useState(false);
  const [teamId, setTeamId] = useState("");

  const [addTeam, setAddTeam] = useState(false);
  const localTeams = JSON.parse(localStorage.getItem("localTeams")) || [];
  const handleEditBtn = (e, teamId) => {
    e.stopPropagation();
    setOpenEditNameModal(true);
    setTeamId(teamId);
  };
  const navigate = useNavigate();
  console.log(localTeams);

  const handleDeletebtn = (e, teamId) => {
    e.stopPropagation();
    console.log(teamId);

    setOpenDeleteTeamModal(true);
    setTeamId(teamId);
  };

  const handleClickBtn = (team) => {
    const teamId = team.teamId;
    navigate(`${teamId}/add-players`);
  };
  const handleAddTeam = () => {
    setAddTeam(true);
  };

  return (
    <div className="flex justify-center h-dvh relative pt-12">
      <Header data="My Teams" />
      {localTeams.length === 0 ? (
        <div className="w-auto flex flex-col items-center justify-center">
          <NoDataFoundPage
            image={noData}
            title="No match found"
            description="There are no match available right now."
          />
        </div>
      ) : (
        <div className="w-full p-2 lg:w-[60%]">
          <ul className="flex flex-col gap-3">
            <div className="mt-4 flex items-center gap-2">
              <h1 className="font-semibold">Total Teams</h1>
              <p className="font-bold">
                {localTeams?.length > 1 ? localTeams.length : 0}
              </p>
            </div>
            {localTeams.map((team) => {
              return (
                <li
                  onClick={() => handleClickBtn(team)}
                  key={team.teamId}
                  className="flex justify-between items-center border border-base-content/15 rounded-md p-4"
                >
                  {/* team name and stats */}
                  <div>
                    <h1>{team.name}</h1>
                    <div></div>
                  </div>

                  {/* edit and delete button */}
                  <div className="flex gap-2 items-center">
                    {/* edit button */}
                    <div
                      onClick={(e) => handleEditBtn(e, team.teamId)}
                      className="text-base-content cursor-pointer"
                    >
                      <Pencil size={18} />
                    </div>
                    {/* delete button */}
                    <div
                      onClick={(e) => handleDeletebtn(e, team.teamId)}
                      className="text-red-400 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {openEditNameModal && (
        <LocalTeamNameUpdateModal
          localTeams={localTeams}
          teamId={teamId}
          onClose={() => setOpenEditNameModal(false)}
        />
      )}
      {openDeleteTeamModal && (
        <LocalTeamDeleteModal
          localTeams={localTeams}
          teamId={teamId}
          onClose={() => setOpenDeleteTeamModal(false)}
        />
      )}
      <div className="absolute bottom-10 right-10 p-3 shadow-[0px_0px_10px_rgba(0,0,0,.4)] rounded-lg text-sm font-semibold">
        <button onClick={handleAddTeam}>Add Team</button>
      </div>

      {addTeam && (
        <AddLocalTeamModal
          localTeams={localTeams}
          onClose={() => setAddTeam(false)}
        />
      )}
    </div>
  );
};
