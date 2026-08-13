import { MapPin, Share2, Trash2, Users } from "lucide-react";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import { useNavigate } from "react-router-dom";

export const TeamList = ({ data, tournamentId }) => {
  const navigate = useNavigate();

  const handleTeamClickBtn = (teamId) => {
    navigate(`/my-tournament/${tournamentId}/tournament-teams/${teamId}`);
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
            <p className="text-xs text-base-content/50">
              Registered teams
            </p>
          </div>
        </div>

        <div className="flex min-w-12 items-center justify-center rounded-xl bg-base-200 px-3 py-2">
          <span className="text-lg font-bold text-base-content">
            {teamCount}
          </span>
        </div>
      </div>

      {/* Team List */}
      <ul className="grid grid-cols-1 gap-3 p-3 my-4 md:grid-cols-2 lg:grid-cols-3">
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
              {/* subtle hover accent */}
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
    </>
  );
};