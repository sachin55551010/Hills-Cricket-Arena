export const LocalTeamDeleteModal = ({ localTeams, teamId, onClose }) => {
  //   console.log(localTeams);

  const deleteTeamBtn = () => {
    const deleteTeams = localTeams.filter((team) => team.teamId !== teamId);

    localStorage.setItem("localTeams", JSON.stringify(deleteTeams));
    onClose();
  };

  return (
    <div className="inset-0 fixed flex items-center justify-center backdrop-blur-lg">
      <div className=" border border-base-content/15 rounded-md w-[80%] lg:w-[30%] flex flex-col p-4 gap-4">
        <h6>Update Team</h6>
        <p>
          Are you sure you want to delete this team? All the associated matches
          and players stats of this team will not be deleted.
        </p>
        <div className="mt-8 flex gap-4 justify-end">
          <button onClick={onClose} className="btn btn-soft">
            Cancel
          </button>
          <button onClick={deleteTeamBtn} className="btn btn-info">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
