import { Header } from "../../components/Header";
import noData from "../../../assets/No data-amico.svg";
import { NoDataFoundPage } from "../../components/NoDataFoundPage";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { LocalTeamNameUpdateModal } from "../../components/modals/LocalTeamNameUpdateModal";
import { LocalTeamDeleteModal } from "../../components/modals/LocalTeamDeleteModal";
import { useNavigate } from "react-router-dom";
export const LocalTeamList = () => {
  const [openEditNameModal, setOpenEditNameModal] = useState(false);
  const [openDeleteTeamModal, setOpenDeleteTeamModal] = useState(false);
  const [teamId, setTeamId] = useState("");
  const localTeams = JSON.parse(localStorage.getItem("localTeams")) || [];
  const handleEditBtn = (e, teamId) => {
    e.stopPropagation();
    setOpenEditNameModal(true);
    setTeamId(teamId);
  };
  const navigate = useNavigate();

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

  return (
    <div className="pt-12 flex justify-center">
      <Header data="My Teams" />
      {localTeams.length === 0 ? (
        <div className="pt-10 w-auto flex flex-col items-center justify-center">
          <NoDataFoundPage
            image={noData}
            title="No match found"
            description="There are no match available right now."
          />
        </div>
      ) : (
        <div className="w-full p-2 lg:w-[60%]">
          <ul className="flex flex-col gap-3">
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
                      <MdEdit size={22} />
                    </div>
                    {/* delete button */}
                    <div
                      onClick={(e) => handleDeletebtn(e, team.teamId)}
                      className="text-base-content cursor-pointer"
                    >
                      <MdDelete size={22} />
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
    </div>
  );
};
