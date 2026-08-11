import { TriangleAlert } from "lucide-react";
import { useDeleteTeamMutation } from "../../store/teamApi";
import { useNavigate } from "react-router-dom";

export const DeleteTeamConfirmModal = ({
  setDeleteTeamModalOpen,
  teamId,
  tournamentId,
}) => {
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  const navigate = useNavigate();
  const handleTeamDeleteBtn = async () => {
    await deleteTeam({ tournamentId, teamId }).unwrap();
    navigate(`/my-tournament/${tournamentId}/tournament-teams`);
  };

  return (
    <div className="fixed z-[999] inset-0 h-dvh overflow-hidden flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="rounded-lg flex flex-col items-center gap-6 p-4 w-[90%] md:w-[60%] border border-base-content/20">
        <div className="bg-red-300 p-2 rounded-full">
          <TriangleAlert strokeWidth={3} className="text-red-600" />
        </div>

        <h1 className="font-black text-2xl">Are You Sure ?</h1>
        <p className="font-bold">
          Delete this team permanently? The team will be removed from the
          tournament, and you will no longer be part of it. This action cannot
          be undone.
        </p>
        <div className="flex flex-col gap-4 w-full md:flex-row">
          <button
            onClick={handleTeamDeleteBtn}
            className={`btn btn-error rounded-md md:flex-1 ${
              isDeleting ? "cursor-not-allowed" : ""
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Delete"
            )}
          </button>
          <button
            onClick={() => setDeleteTeamModalOpen(false)}
            className={`btn md:flex-1 btn-accent rounded-md`}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
