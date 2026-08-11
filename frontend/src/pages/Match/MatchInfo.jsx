import React from "react";
import { useGetMatchByIdQuery } from "../../store/matchApi";
import { useNavigate, useParams } from "react-router-dom";
import { defaultAvatar } from "../../utils/noprofilePicHelper";

export const MatchInfo = () => {
  const { matchId } = useParams();
  const { data, isLoading } = useGetMatchByIdQuery(matchId);
  const navigate = useNavigate();
  const firstTeamId = data?.match?.firstTeamId?._id;
  const secondTeamId = data?.match?.secondTeamId?._id;

  const tournamentId = data?.match?.tournamentId?._id;
  console.log(tournamentId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] mt-14">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  const match = data?.match;
  const tournament = match?.tournamentId;

  const handleTeamClickBtn = (teamId) => {
    navigate(
      `/my-tournament/${tournamentId}/tournament-teams/${teamId}/team-info`,
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-4 mt-14">
      {/* Match */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body items-center text-center">
          <p className="text-lg font-bold text-base-content/60">
            {tournament?.tournamentName}
          </p>

          <div className="flex items-center justify-center gap-6 my-6">
            {/* First Team */}
            <div
              onClick={() => handleTeamClickBtn(firstTeamId)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              {match?.firstTeamId?.teamLogo ? (
                <img
                  src={match.firstTeamId.teamLogo}
                  alt={match.firstTeamId.teamName}
                  className="w-16 h-16 rounded-full object-cover border border-base-300"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
                  {defaultAvatar(match?.firstTeamId?.teamName) || "T1"}
                </div>
              )}

              <h1 className="capitalize font-bold text-center">
                {match?.firstTeamId?.teamName || "Team 1"}
              </h1>
            </div>

            {/* VS */}
            <div className="text-base-content/40 font-bold">VS</div>

            {/* Second Team */}
            <div
              onClick={() => handleTeamClickBtn(secondTeamId)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              {match?.secondTeamId?.teamLogo ? (
                <img
                  src={match.secondTeamId.teamLogo}
                  alt={match.secondTeamId.teamName}
                  className="w-16 h-16 rounded-full object-cover border border-base-300"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
                  {defaultAvatar(match?.secondTeamId?.teamName) || "T2"}
                </div>
              )}

              <h1 className="capitalize font-bold text-center">
                {match?.secondTeamId?.teamName || "Team 2"}
              </h1>
            </div>
          </div>

          <div className="text-center">
            <div className="badge badge-primary">{match?.round}</div>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="p-2">
          <h2 className="card-title text-lg">Match Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <InfoItem
              label="Date"
              value={new Date(match?.matchScheduleDate).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            />

            <InfoItem
              label="Venue"
              value={`${tournament?.ground}, ${tournament?.city}`}
            />

            <InfoItem label="Overs" value={`${match?.overs} overs`} />

            <InfoItem label="Category" value={tournament?.tournamentCategory} />

            <InfoItem label="Ball Type" value={tournament?.ballType} />

            <InfoItem label="Pitch Type" value={tournament?.pitchType} />

            <InfoItem label="Tournament" value={tournament?.tournamentName} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="rounded-lg bg-base-200 p-3">
    <p className="text-xs text-base-content/60">{label}</p>
    <p className="font-medium capitalize mt-1">{value || "—"}</p>
  </div>
);
