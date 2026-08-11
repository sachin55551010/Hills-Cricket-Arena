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
    <div className="flex flex-col items-center px-2 mt-14">
      {/* Tournament */}
      <h1 className="px-3 text-lg font-semibold">
        {match?.tournamentId?.tournamentName}
      </h1>

      {/* Teams */}
      <div className="mx-3 mt-4 grid w-full grid-cols-2 rounded-md border border-base-300 p-2 sm:p-4 lg:w-[70%]">
        {teams.map((team, teamIndex) => (
          <div
            key={team?._id || teamIndex}
            className={`
            px-1 sm:px-2
            ${teamIndex === 0 ? "border-r border-base-200" : ""}
          `}
          >
            {/* Team */}
            <div className="flex flex-col items-center pb-3">
              {team?.teamLogo ? (
                <img
                  src={team.teamLogo}
                  alt={team.teamName}
                  className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-200 text-lg font-semibold text-base-content sm:h-14 sm:w-14">
                  {defaultAvatar(team?.teamName)}
                </div>
              )}

              <h2 className="mt-2 text-center text-sm font-semibold capitalize text-base-content">
                {team?.teamName}
              </h2>
            </div>

            {/* Players */}
            <div className="w-full">
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
                      className="flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 transition hover:bg-base-200 sm:gap-2 sm:py-2"
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
                      <p className="min-w-0 flex-1 text-left text-xs leading-tight text-base-content sm:text-sm">
                        <span className="break-words">{playerName}</span>

                        {role && (
                          <span className="ml-1 text-[0.7rem] text-base-content/60 sm:text-[0.8rem]">
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
