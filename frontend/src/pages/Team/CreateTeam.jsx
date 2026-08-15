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
    <div className="min-h-dvh pt-24 px-3 sm:px-4 pb-8 flex justify-center overflow-y-auto bg-base-200/40">
  <form
    onSubmit={handleSubmitBtn}
    className="w-full md:w-[70%] lg:w-[65%] xl:w-[55%] h-fit mt-2 overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-xl shadow-base-content/5"
  >
    {/* Header */}
    <div className="px-5 sm:px-7 pt-6 pb-5 border-b border-base-content/10">
      <div className="flex items-center gap-3">
        <div className="" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {mode === "edit" ? "Edit Team" : "Create Your Team"}
          </h2>
          <p className="text-xs sm:text-sm text-base-content/50 mt-1">
            {mode === "edit"
              ? "Update your team's information"
              : "Add your team details to get started"}
          </p>
        </div>
      </div>
    </div>

    {/* Team logo */}
    <div className="flex flex-col items-center py-7 sm:py-8">
      <div className="relative group">
        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 border border-warning/50">
          <img
            src={selectTeamLogo || "/avatar.jpg"}
            alt="Team logo"
            className="h-full w-full rounded-full object-cover border-4 border-base-100 shadow-lg"
          />
        </div>

        <label htmlFor="image">
          <div className="absolute bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-warning text-warning-content shadow-md border-2 border-base-100 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg">
            <Camera size={18} strokeWidth={2.5} />
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

      <p className="mt-3 text-sm font-medium text-base-content/60">
        Choose Team Logo
      </p>
      <p className="text-xs text-base-content/40 mt-1">
        JPG, PNG or other image formats
      </p>
    </div>

    {/* Form fields */}
    <div className="px-5 sm:px-7 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-sm">
        <label
          htmlFor="team-name"
          className="flex flex-col gap-2 text-base-content/60 font-medium"
        >
          Team Name*
          <input
            value={teamData.teamName}
            onChange={(e) =>
              setTeamData({ ...teamData, teamName: e.target.value })
            }
            id="team-name"
            type="text"
            placeholder="Enter team name"
            className="w-full h-11 rounded-xl border border-base-content/15 bg-base-200/40 px-3.5 text-base-content outline-none transition-all placeholder:text-base-content/30 focus:border-warning focus:ring-2 focus:ring-warning/20 capitalize"
          />
        </label>

        <label
          htmlFor="city-name"
          className="flex flex-col gap-2 text-base-content/60 font-medium"
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
            placeholder="Enter city name"
            className="w-full h-11 rounded-xl border border-base-content/15 bg-base-200/40 px-3.5 text-base-content outline-none transition-all placeholder:text-base-content/30 focus:border-warning focus:ring-2 focus:ring-warning/20 capitalize"
          />
        </label>

        <label
          htmlFor="number"
          className="flex flex-col gap-2 text-base-content/60 font-medium"
        >
          Admin/Coordinator Number
          <span className="text-[11px] text-base-content/35 font-normal -mt-1">
            Optional
          </span>

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
            placeholder="Enter contact number"
            className="w-full h-11 rounded-xl border border-base-content/15 bg-base-200/40 px-3.5 text-base-content outline-none transition-all placeholder:text-base-content/30 focus:border-warning focus:ring-2 focus:ring-warning/20"
          />
        </label>

        <label
          htmlFor="captain-name"
          className="flex flex-col gap-2 text-base-content/60 font-medium"
        >
          Admin/Coordinator Name
          <span className="text-[11px] text-base-content/35 font-normal -mt-1">
            Optional
          </span>

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
            placeholder="Enter coordinator name"
            className="w-full h-11 rounded-xl border border-base-content/15 bg-base-200/40 px-3.5 text-base-content outline-none transition-all placeholder:text-base-content/30 focus:border-warning focus:ring-2 focus:ring-warning/20 capitalize"
          />
        </label>
      </div>

      {/* Add myself */}
      <label className="mt-6 flex items-center gap-3 p-3.5 rounded-xl border border-base-content/10 bg-base-200/30 cursor-pointer transition-colors hover:bg-base-200/60">
        <input
          checked={teamData.addMe}
          onChange={(e) =>
            setTeamData((prev) => ({ ...prev, addMe: e.target.checked }))
          }
          type="checkbox"
          className="checkbox checkbox-warning h-5 w-5 checkbox-sm"
        />

        <div>
          <p className="text-sm font-medium">Add myself in team</p>
          <p className="text-xs text-base-content/40 mt-0.5">
            Automatically add yourself as a team member
          </p>
        </div>
      </label>

      {/* Actions */}
      <div className="mt-6">
        {mode === "edit" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="btn btn-warning w-full rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <span>Updating</span>
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : (
                "Update Team"
              )}
            </button>

            <button
              type="button"
              onClick={() => setDeleteTeamModalOpen(true)}
              className="btn btn-error btn-outline w-full rounded-xl transition-all"
              disabled={isUpdating}
            >
              Delete Team
            </button>
          </div>
        ) : (
          <button
            className="btn btn-info w-full rounded-xl border-0 shadow-sm hover:shadow-md transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Add Team"
            )}
          </button>
        )}
      </div>
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
