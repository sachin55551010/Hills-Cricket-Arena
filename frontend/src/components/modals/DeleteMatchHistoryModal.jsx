export const DeleteMatchHistoryModal = ({ onClose, matchId, matchList }) => {
  const deleteTeam = () => {
    const updatedMatch = matchList.filter((match) => match.matchId !== matchId);
    localStorage.setItem("matchHistory", JSON.stringify(updatedMatch));
    onClose();
  };
  return (
    <div className="inset-0 fixed flex items-center justify-center backdrop-blur-lg">
      <div className=" border border-base-content/15 rounded-md w-[80%] lg:w-[30%] flex flex-col p-4 gap-4">
        <h6>Update Team</h6>
        <p>
          Are you sure you want to delete this match? All the players statistics
          associated with this match will also be deleted.
        </p>
        <div className="mt-8 flex gap-4 justify-end">
          <button onClick={onClose} className="btn btn-soft">
            Cancel
          </button>
          <button onClick={deleteTeam} className="btn btn-info">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
