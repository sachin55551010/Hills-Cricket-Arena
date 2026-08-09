import React from "react";
import { useGetMatchByIdQuery } from "../../store/matchApi";
import { useNavigate, useParams } from "react-router-dom";
import { defaultAvatar } from "../../utils/noprofilePicHelper";

export const MatchSquad = () => {
  const { matchId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetMatchByIdQuery(matchId);

  const handlePlayerClickBtn = (playerId) => {
    navigate(`/profile/${playerId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data?.match) {
    return <div>Failed to load squad</div>;
  }

  const match = data.match;

  const teams = [match?.firstTeamId, match?.secondTeamId];

  const getPlayerRole = (role = []) => {
    if (!role?.length) return "";

    if (role.includes("Captain")) return "C";
    if (role.includes("Vice Captain")) return "VC";
    if (role.includes("Wicket Keeper")) return "WK";

    return "";
  };

  return (
    <div className="flex flex-col items-center w-full p-3">
      {/* Tournament */}
      <h1 className="text-center text-lg font-semibold text-base-content mt-4 capitalize">
        {match?.tournamentId?.tournamentName}
      </h1>

      {/* Teams */}
      <div className="grid mx-3 grid-cols-2 rounded-md p-4 border border-base-300 mt-4 w-full lg:w-[70%]">
        {teams.map((team, teamIndex) => (
          <div
            key={team?._id || teamIndex}
            className={`
              px-4
              ${teamIndex === 0 ? "border-r border-base-200" : ""}
            `}
          >
            {/* Team */}
            <div className="flex flex-col items-center pb-4">
              {team?.teamLogo ? (
                <img
                  src={team.teamLogo}
                  alt={team.teamName}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200 text-lg font-semibold text-base-content">
                  {defaultAvatar(team?.teamName)}
                </div>
              )}

              <h2 className="mt-2 text-center text-sm font-semibold capitalize text-base-content">
                {team?.teamName}
              </h2>
            </div>

            {/* Players */}
            <div>
              {team?.teamPlayers?.length ? (
                team.teamPlayers.map((member, index) => {
                  const player = member?.player;

                  const playerId = player?._id;

                  const playerName =
                    player?.playerName || `Player ${index + 1}`;

                  const role = getPlayerRole(member?.role);

                  return (
                    <div
                      key={playerId || index}
                      onClick={() => handlePlayerClickBtn(playerId)}
                      className="flex cursor-pointer items-center gap-2 rounded-md py-2 transition hover:bg-base-200"
                    >
                      {/* Profile */}
                      {player?.profilePicture ? (
                        <img
                          src={player.profilePicture}
                          alt={playerName}
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-xs font-semibold text-base-content">
                          {defaultAvatar(playerName)}
                        </div>
                      )}

                      {/* Name + Role */}
                      <p className="min-w-0 truncate text-sm text-base-content">
                        {playerName}{" "}
                        {role && (
                          <span className="text-[0.8rem] text-base-content/60">
                            ({role})
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="py-4 text-center text-xs text-base-content/50">
                  No players
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
