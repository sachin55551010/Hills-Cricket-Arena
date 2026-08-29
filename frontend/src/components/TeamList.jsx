import { MapPin, Users, Plus, X } from "lucide-react";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const TeamList = ({ data, tournamentId }) => {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleTeamClickBtn = (teamId) => {
    navigate(`/my-tournament/${tournamentId}/tournament-teams/${teamId}`);
  };

  // CREATE TEAM
  const handleCreateTeam = () => {
    const trimmedName = teamName.trim();

    if (!trimmedName) return;

    // 👇 Put your API / dispatch logic here
    console.log("Creating team:", trimmedName);
    console.log("Tournament ID:", tournamentId);

    // Example:
    // dispatch(createTeam({
    //   tournamentId,
    //   teamName: trimmedName,
    // }));

    // Clear input
    setTeamName("");

    // Close modal
    setShowCreateModal(false);
  };

  const handleCloseModal = () => {
    setTeamName("");
    setShowCreateModal(false);
  };

  const teamList = data?.myTournamentTeams;
  const teamCount = data?.countTeams;

  return (
    <>
      {/* Header */}
      <div className="mx-3 mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
            <Users size={21} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-sm font-bold text-base-content">
              Tournament Teams
            </h1>

            <p className="text-xs text-base-content/50">Registered teams</p>
          </div>
        </div>

        <div className="flex min-w-12 items-center justify-center rounded-xl bg-base-200 px-3 py-2">
          <span className="text-lg font-bold text-base-content">
            {teamCount}
          </span>
        </div>
      </div>

      {/* Team List */}
      <ul className="my-4 grid grid-cols-1 gap-3 p-3 md:grid-cols-2 lg:grid-cols-3">
        {teamList?.map((teams) => {
          return (
            <li
              onClick={() => handleTeamClickBtn(teams._id)}
              key={teams._id}
              className="
                group
                relative
                flex
                cursor-pointer
                gap-3
                overflow-hidden
                rounded-2xl
                border
                border-base-content/10
                bg-base-100
                p-3
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-success/30
                hover:shadow-md
              "
            >
              {/* Hover Accent */}
              <div className="absolute inset-y-0 left-0 w-1 bg-success/0 transition-all duration-300 group-hover:bg-success/70" />

              {/* Team Logo */}
              <div className="shrink-0">
                {teams.teamLogo === "" ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-base-content/10 bg-base-200 text-lg font-extrabold text-base-content/60">
                    {defaultAvatar(teams.teamName)}
                  </div>
                ) : (
                  <img
                    src={teams.teamLogo}
                    alt=""
                    className="h-14 w-14 rounded-2xl border border-base-content/10 bg-base-200 object-cover"
                  />
                )}
              </div>

              {/* Team Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="truncate text-sm font-bold capitalize text-base-content">
                    {teams.teamName}
                  </h1>

                  <span className="shrink-0 rounded-full bg-base-200 px-2 py-1 text-[10px] font-semibold text-base-content/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View
                  </span>
                </div>

                {/* Team Info */}
                <div className="flex min-w-0 items-center gap-3">
                  {/* City */}
                  <div className="flex min-w-0 items-center gap-1.5 text-base-content/50">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-base-200 text-success">
                      <MapPin size={13} strokeWidth={2.2} />
                    </div>

                    <h4 className="truncate text-[11px] font-semibold capitalize">
                      {teams.city}
                    </h4>
                  </div>

                  {/* Captain */}
                  {teams.captainName && (
                    <>
                      <div className="h-4 w-px bg-base-content/10" />

                      <div className="flex min-w-0 items-center gap-1.5 text-base-content/50">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-bold text-accent">
                          C
                        </span>

                        <h4 className="truncate text-[11px] font-semibold capitalize">
                          {teams.captainName || "No info"}
                        </h4>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* ========================================= */}
      {/* FIXED CREATE TEAM BUTTON */}
      {/* ========================================= */}

      <button
        onClick={() => setShowCreateModal(true)}
        className="
          fixed
          bottom-6
          right-6
          z-40
          flex
          items-center
          gap-2
          rounded-2xl
          bg-success
          px-5
          py-3
          text-sm
          font-bold
          text-success-content
          shadow-lg
          shadow-success/20
          transition-all
          duration-200
          hover:scale-105
          hover:shadow-xl
          active:scale-95
        "
      >
        <Plus size={19} strokeWidth={2.5} />
        Create Team
      </button>

      {/* ========================================= */}
      {/* CREATE TEAM MODAL */}
      {/* ========================================= */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              bg-base-100
              p-5
              shadow-2xl
            "
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="
                absolute
                right-4
                top-4
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-base-200
                text-base-content/60
                transition
                hover:bg-base-300
              "
            >
              <X size={17} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
                <Users size={21} />
              </div>

              <h2 className="text-lg font-bold text-base-content">
                Create Team
              </h2>

              <p className="mt-1 text-xs text-base-content/50">
                Enter a name for your new team.
              </p>
            </div>

            {/* Team Name */}
            <div className="form-control">
              <label className="mb-2 text-xs font-semibold text-base-content/70">
                Team Name
              </label>

              <input
                type="text"
                placeholder="e.g. Warriors"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateTeam();
                  }
                }}
                autoFocus
                className="
                  input
                  input-bordered
                  w-full
                  rounded-xl
                  bg-base-200
                  text-sm
                  outline-none
                  focus:border-success
                "
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost rounded-xl text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTeam}
                disabled={!teamName.trim()}
                className="
                  btn
                  rounded-xl
                  bg-success
                  px-5
                  text-sm
                  text-success-content
                  hover:bg-success/90
                "
              >
                <Plus size={17} />
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
