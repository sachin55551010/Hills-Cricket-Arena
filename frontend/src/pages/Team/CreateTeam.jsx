import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateTeamMutation,
  useGetTeamByIdQuery,
  useUpdateTeamMutation,
} from "../../store/teamApi";
import { validateInputs } from "../../utils/validateInputs";
import { Camera } from "lucide-react";
import { useSelector } from "react-redux";
import { DeleteTeamConfirmModal } from "../../components/modals/DeleteTeamConfirmModal";
export const CreateTeam = ({ mode }) => {
  const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [selectTeamLogo, setSelectTeamLogo] = useState(null);
  const { tournamentId } = useParams();
  const { teamId } = useParams();
  const { authUser } = useSelector((state) => state.auth);

  const { data, isLoading: isTeamLoading } = useGetTeamByIdQuery(teamId, {
    skip: !teamId, // if id undefind it will skip it and no error in console log of undefined id
  });

  // const varifyTeamAdmin = authUser?.player?._id === data?.team?.createdBy;
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();

  const checkIsPlayerInTeam = Boolean(
    data?.team?.teamPlayers?.find(
      (elem) => elem.player === authUser?.player?._id,
    ),
  );

  const navigate = useNavigate();
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [teamData, setTeamData] = useState({
    teamLogo: "",
    teamName: "",
    city: "",
    adminNumber: "",
    adminName: "",
    addMe: false,
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      setTeamData((prev) => ({
        ...prev,
        teamName: data?.team?.teamName ?? "",
        teamLogo: data?.team?.teamLogo ?? "",
        city: data?.team?.city ?? "",
        adminNumber: data?.team?.adminNumber ?? "",
        adminName: data?.team?.adminName ?? "",
        addMe: checkIsPlayerInTeam,
      }));
      setSelectTeamLogo(data?.team?.teamLogo ?? "");
    }
  }, [mode, data, checkIsPlayerInTeam]);

  //function to upload image
  const uploadLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectTeamLogo(base64Image);
      setTeamData((prev) => ({ ...prev, teamLogo: base64Image }));
    };
  };

  const handleSubmitBtn = async (e) => {
    try {
      e.preventDefault();
      if (mode === "edit") {
        await updateTeam({ tournamentId, teamId, teamData }).unwrap();
        navigate(
          `/my-tournament/${tournamentId}/tournament-teams/${teamId}/team-info`,
        );
      } else {
        await createTeam({ tournamentId, teamData }).unwrap();
        navigate(`/my-tournament/${tournamentId}/tournament-teams`);
      }
    } catch (error) {
      console.error("create team error", error);
    }
  };

  if (isTeamLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-dvh pt-24 px-2 flex justify-center overflow-y-scroll">
      <form
        onSubmit={handleSubmitBtn}
        className="border border-base-content/20 h-fit p-4 w-full rounded-lg mt-4 md:w-[70%]"
      >
        {/* team logo or picture  */}
        <div className="flex flex-col items-center gap-3">
          {/*team logo image section */}
          <div className="h-22 w-22 rounded-full relative">
            <img
              src={selectTeamLogo || "/avatar.jpg"}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
            <label htmlFor="image">
              <div className="bg-warning p-1 w-fit absolute rounded-full top-[70%] right-[-5%] cursor-pointer">
                <Camera size={22} />
              </div>
              <input
                onChange={uploadLogo}
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
          <p className="text-sm ">Choose Team Logo</p>
        </div>

        {/* input fields  */}
        <div className="grid grid-cols-1 gap-4 w-full text-sm md:grid-cols-2 md:gap-8 md:mt-6">
          <label
            htmlFor="team-name"
            className="flex flex-col gap-2 text-base-content/50 "
          >
            Team Name*
            <input
              value={teamData.teamName}
              onChange={(e) =>
                setTeamData({ ...teamData, teamName: e.target.value })
              }
              id="team-name"
              type="text"
              placeholder="Team Name"
              className="border border-base-content/30 h-10 rounded-md pl-2 outline-0 text-base-content capitalize"
            />
          </label>
          <label
            htmlFor="city-name"
            className="flex flex-col gap-2 text-base-content/50"
          >
            City*
            <input
              value={teamData.city}
              onChange={(e) => {
                const { value } = e.target;
                if (validateInputs(value)) {
                  setTeamData({ ...teamData, city: value });
                }
              }}
              id="city-name"
              type="text"
              placeholder="City Name"
              className="border border-base-content/30 h-10 rounded-md pl-2 outline-0 text-base-content capitalize"
            />
          </label>
          <label
            htmlFor="number"
            className="flex flex-col gap-2 text-base-content/50"
          >
            Admin/Coordinator Number (Optional)
            <input
              value={teamData.adminNumber}
              onChange={(e) => {
                const { value } = e.target;
                const regex = /^[0-9]*$/;
                if (regex.test(value)) {
                  setTeamData({ ...teamData, adminNumber: value });
                }
              }}
              id="number"
              type="text"
              maxLength={10}
              placeholder="Contact Number"
              className="border border-base-content/30 h-10 rounded-md pl-2 outline-0 text-base-content"
            />
          </label>
          <label
            htmlFor="captain-name"
            className="flex flex-col gap-2 text-base-content/50 capitalize"
          >
            Admin/Coordinator Name(Optional)
            <input
              value={teamData.adminName}
              onChange={(e) => {
                const { value } = e.target;
                if (validateInputs(value)) {
                  setTeamData({ ...teamData, adminName: value });
                }
              }}
              id="captain-name"
              type="text"
              placeholder="Captain Name"
              className="border border-base-content/30 h-10 rounded-md pl-2 outline-0 text-base-content capitalize"
            />
          </label>
        </div>

        <div className="flex w-full mt-6 gap-2">
          <input
            checked={teamData.addMe}
            onChange={(e) =>
              setTeamData((prev) => ({ ...prev, addMe: e.target.checked }))
            }
            type="checkbox"
          />
          <p className="text-sm text-base-content/50">Add my self in team</p>
        </div>

        <div className="">
          {mode === "edit" ? (
            <div className="grid grid-cols-1 w-full gap-2 md:grid-cols-2 mt-4">
              <button
                className={` btn btn-warning w-full rounded-md`}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="flex gap-2">
                    <span>Updating</span>
                    <span className="loading loading-spinner loading-sm"></span>
                  </div>
                ) : (
                  "Update"
                )}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTeamModalOpen(true)}
                className={`btn btn-error w-full rounded-md`}
                disabled={isUpdating}
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              className={`btn btn-info w-full rounded-md mt-4`}
              disabled={isLoading}
            >
              {isLoading ? <span className="loading"></span> : "Add Team"}
            </button>
          )}
        </div>
      </form>
      {deleteTeamModalOpen && (
        <DeleteTeamConfirmModal
          setDeleteTeamModalOpen={setDeleteTeamModalOpen}
          teamId={teamId}
          tournamentId={tournamentId}
        />
      )}
    </div>
  );
};
