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
      <div className="mx-3 flex items-center justify-between px-2">
        <div className="badge badge-soft badge-success flex gap-2 my-4 items-center py-6 px-4">
          <Users size={25} />
          <h1 className="font-bold text-base-content/60">Teams</h1>
          <span className="font-bold text-xl">{teamCount}</span>
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 my-4">
        {teamList?.map((teams) => {
          return (
            <li
              onClick={() => handleTeamClickBtn(teams._id)}
              key={teams._id}
              className="p-2 flex gap-4 rounded-md border border-base-content/20 cursor-pointer hover:scale-102 duration-300"
            >
              {/* team logo */}
              <div>
                {teams.teamLogo === "" ? (
                  <div className="h-12 w-12 rounded-full bg-base-300 border flex items-center justify-center font-extrabold text-bg-content">
                    {defaultAvatar(teams.teamName)}
                  </div>
                ) : (
                  <img
                    src={teams.teamLogo}
                    alt=""
                    className="h-12 w-14 rounded-full object-cover bg-red-400"
                  />
                )}
              </div>

              {/* team details */}
              <div className="flex flex-col justify-between w-full gap-2">
                <h1 className="font-bold text-sm capitalize">
                  {teams.teamName}
                </h1>

                {/* team captain vice captain info */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex gap-2 items-center text-[.75rem] text-base-content/60">
                    <div className="badge badge-soft badge-accent p-1 rounded-full">
                      <MapPin size={15} />
                    </div>

                    <h4 className="capitalize font-bold">{teams.city}</h4>
                  </div>

                  {teams.captainName && (
                    <div className="flex-1 flex gap-2 items-center text-[.75rem] text-base-content/60">
                      <h4 className="badge badge-soft badge-accent rounded-full w-3 h-auto font-bold">
                        C
                      </h4>
                      <h4 className="capitalize font-bold">
                        {teams.captainName || "No info"}
                      </h4>
                    </div>
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
