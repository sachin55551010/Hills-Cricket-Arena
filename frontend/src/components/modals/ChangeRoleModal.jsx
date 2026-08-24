import { Check, X } from "lucide-react";
import { ROLE } from "../../constant/role";
import { useEffect, useState } from "react";
import {
  useGetTeamByIdQuery,
  useRemovePlayerFromTeamMutation,
  useUpdateTeamPlayerRoleMutation,
} from "../../store/teamApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const ChangeRoleModal = ({
  setChangeRoleModal,
  selectPlayerId,
  teamId,
  tournamentId,
  teamPlayers,
}) => {
  const [selectedRole, setSelectedRole] = useState([]);
  const [updateTeamPlayerRole, { isLoading: isRoleUpdating }] =
    useUpdateTeamPlayerRoleMutation();
  const handleOnCLick = (id) => {
    setSelectedRole((prev) =>
      prev.includes(id)
        ? prev.filter((roleId) => roleId !== id)
        : [...prev, id],
    );
  };

  const { data } = useGetTeamByIdQuery(teamId);
  const { authUser } = useSelector((state) => state.auth);
  const loggedInUserId = authUser?.player?._id;
  const checkTeamAdmin = data?.team?.createdBy;

  const [removePlayerFromTeam, { isLoading: isPlayerRemoving }] =
    useRemovePlayerFromTeamMutation();
  // handle confirm button
  const handleConfirmBtn = async () => {
    await updateTeamPlayerRole({
      teamId,
      playerId: selectPlayerId,
      role: selectedRole,
    }).unwrap();
    setChangeRoleModal(false);
  };

  const handlePlayerRemoveBtn = async () => {
    await removePlayerFromTeam({
      tournamentId,
      teamId,
      playerId: selectPlayerId,
    }).unwrap();
    setChangeRoleModal(false);
  };
  // console.log(teamPlayers);

  const playerRole = teamPlayers?.myTeamPlayers?.teamPlayers.find(
    (player) => player.player._id === selectPlayerId,
  );

  useEffect(() => {
    if (playerRole?.role.length > 0) {
      setSelectedRole(playerRole.role);
    }
  }, [playerRole]);

  //handle close modal
  const handleCloseModal = () => {
    setChangeRoleModal(false);
  };
  return (
    <div className="fixed inset-0 z-[99999] flex h-dvh w-full items-center justify-center bg-base-content/20 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-base-content/10 px-5 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Choose Role</h1>
            <p className="mt-0.5 text-sm text-base-content/50">
              Select the role for this player
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleCloseModal}
            className="flex h-9 w-9 items-center justify-center rounded-full text-base-content/60 transition-all hover:bg-base-content/10 hover:text-base-content active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </header>

        {/* Role options */}
        <ul className="flex w-full flex-col gap-3 p-5">
          {ROLE.map((role) => {
            const Icon = role.icon;

            return (
              <button
                disabled={selectedRole.includes(role.conflictWith)}
                onClick={() => handleOnCLick(role.id)}
                key={role.id}
                className={`
                group flex w-full items-center justify-between rounded-xl
                border p-3.5 text-left
                transition-all duration-200

                ${
                  !selectedRole.includes(role.id)
                    ? "border-base-content/10 bg-base-100/30 hover:-translate-y-[1px] hover:border-base-content/20 hover:bg-base-content/5 hover:shadow-md"
                    : "border-info/40 bg-info/10 shadow-sm"
                }

                ${
                  selectedRole.includes(role.conflictWith)
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
                }
              `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-xl bg-gradient-to-br ${role.gradient}
                    shadow-sm
                    transition-transform duration-200
                    group-hover:scale-105
                  `}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <h4 className="font-semibold">{role.name}</h4>

                    {selectedRole.includes(role.id) && (
                      <p className="mt-0.5 text-xs text-info">Selected</p>
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <span
                  className={`
                  flex h-6 w-6 items-center justify-center rounded-full
                  transition-all duration-200

                  ${
                    selectedRole.includes(role.id)
                      ? "bg-info text-info-content shadow-sm"
                      : "border border-base-content/20 bg-base-100"
                  }
                `}
                >
                  {selectedRole.includes(role.id) && (
                    <Check size={15} strokeWidth={3} />
                  )}
                </span>
              </button>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="border-t border-base-content/10 bg-base-200/20 px-5 py-4">
          <div className="flex gap-3">
            {loggedInUserId === checkTeamAdmin && (
              <button
                onClick={handlePlayerRemoveBtn}
                className="btn btn-error flex-1 rounded-xl"
                disabled={isRoleUpdating || isPlayerRemoving}
              >
                {isPlayerRemoving ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "Remove"
                )}
              </button>
            )}

            <Link
              aria-disabled={isPlayerRemoving || isRoleUpdating}
              onClick={(e) =>
                isPlayerRemoving || (isRoleUpdating && e.preventDefault())
              }
              to={`/profile/${selectPlayerId}`}
              className="flex-1"
            >
              <button
                disabled={isRoleUpdating || isPlayerRemoving}
                className="btn btn-success w-full rounded-xl"
              >
                Profile
              </button>
            </Link>
          </div>

          <button
            onClick={handleConfirmBtn}
            className="btn btn-info mt-3 w-full rounded-xl shadow-sm transition-all hover:shadow-md"
            disabled={isRoleUpdating || isPlayerRemoving}
          >
            {isRoleUpdating ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
