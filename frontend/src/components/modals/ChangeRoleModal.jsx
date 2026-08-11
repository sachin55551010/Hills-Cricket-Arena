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
    <div className="fixed z-[999] inset-0 h-dvh w-auto flex items-center justify-center backdrop-blur-md">
      <div className="border border-base-content/40 rounded-md w-[90%] flex flex-col items-center md:w-[60%]">
        {/* header */}
        <header className="border-b-1 py-4 w-full  flex items-center justify-between px-4 bg-base-content/10 rounded-t-md">
          <h1 className="font-bold text-2xl">Choose Role</h1>
          {/* close button */}
          <div
            onClick={handleCloseModal}
            className="cursor-pointer hover:bg-base-content/30 p-2 rounded-md"
          >
            <X strokeWidth={4} />
          </div>
        </header>

        {/* role options */}
        <ul className="w-full flex flex-col gap-6 mt-4 p-4">
          {ROLE.map((role) => {
            const Icon = role.icon;

            return (
              <button
                disabled={selectedRole.includes(role.conflictWith)}
                onClick={() => handleOnCLick(role.id)}
                key={role.id}
                className={`${
                  !selectedRole.includes(role.id)
                    ? "border-2 border-base-content/30"
                    : "border-2 border-base-content bg-base-content/20"
                } py-3 px-2 rounded-md flex justify-between items-center ${
                  selectedRole.includes(role.conflictWith)
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:cursor-pointer "
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`bg-gradient-to-br ${role.gradient} p-2 rounded-md flex items-center justify-center`}
                  >
                    <Icon size={20} />
                  </div>

                  <h4 className="font-bold text-md">{role.name}</h4>
                </div>

                <span
                  className={`h-5 w-5  rounded-md flex items-center justify-center ${
                    selectedRole.includes(role.id)
                      ? "bg-info border-2 border-base-content"
                      : "border-2 border-base-content/30"
                  }`}
                >
                  {selectedRole.includes(role.id) ? (
                    <Check strokeWidth={4} />
                  ) : (
                    ""
                  )}
                </span>
              </button>
            );
          })}
        </ul>

        {/* close and confirm button */}
        <div className="flex flex-col gap-2 mt-4 w-full mb-4 px-4">
          <div className="flex rounded-md hover:cursor-pointer gap-3">
            {loggedInUserId === checkTeamAdmin && (
              <button
                onClick={handlePlayerRemoveBtn}
                className="flex-1 btn btn-error"
                disabled={isRoleUpdating || isPlayerRemoving}
              >
                {isPlayerRemoving ? (
                  <span className="loading loading-dots loading-xl"></span>
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
              className="flex-1 btn btn-success"
            >
              <button disabled={isRoleUpdating || isPlayerRemoving}>
                Profile
              </button>
            </Link>
          </div>
          <button
            onClick={handleConfirmBtn}
            className={`btn btn-info rounded-md hover:cursor-pointer`}
            disabled={isRoleUpdating || isPlayerRemoving}
          >
            {isRoleUpdating ? (
              <span className="loading loading-dots loading-xl"></span>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
