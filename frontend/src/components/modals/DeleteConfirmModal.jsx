import { TriangleAlert } from "lucide-react";
import { useDeleteTournamentMutation } from "../../store/tournamentApi";

export const DeleteConfirmModal = ({
  setIsDeleteModal,
  tournamentId,
  navigate,
}) => {
  const [deleteTournament, { isLoading: isDeleting }] =
    useDeleteTournamentMutation();

  const handleDeleteBtn = async () => {
    await deleteTournament(tournamentId).unwrap();
    setIsDeleteModal(false);
    navigate("/my-tournament");
  };

  return (
    <div className="fixed z-[999] inset-0 h-dvh overflow-hidden flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="rounded-lg flex flex-col items-center gap-6 p-4 w-[90%] md:w-[60%] border border-base-content/20">
        <div className="bg-red-300 p-2 rounded-full">
          <TriangleAlert strokeWidth={3} className="text-red-600" />
        </div>

        <h1 className="font-black text-2xl">Are You Sure ?</h1>
        <p className="font-bold">
          Are you sure you want to delete this tournament? This action cannot be
          undone.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleDeleteBtn}
            className={`btn btn-error rounded-md ${
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
            onClick={() => setIsDeleteModal(false)}
            className={`btn btn-accent rounded-md`}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
