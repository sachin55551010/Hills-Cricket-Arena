import { useParams } from "react-router-dom";
import { useGetTeamByIdQuery } from "../../store/teamApi";
import { Hash, MapPin, Shield } from "lucide-react";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import { useSelector } from "react-redux";
import { useGetTournamentInfoQuery } from "../../store/tournamentApi";

export const TeamInfoPage = () => {
  const { teamId } = useParams();
  const { data, isLoading } = useGetTeamByIdQuery(teamId);
  const tournamentId = data?.team?.tournamentId;

  const { data: tournamentData } = useGetTournamentInfoQuery(tournamentId);
  const { authUser } = useSelector((state) => state.auth);
  // console.log("Loggedin user", authUser?.player?._id);
  const organiserId = tournamentData?.myTournament?.createdBy?._id;
  const loggedInUserId = authUser?.player?._id;
  const teamAdminId = data?.team?.createdBy;

  const canSeeAdminNumber =
    loggedInUserId === organiserId || loggedInUserId === teamAdminId;

  if (isLoading) {
    return (
      <div className="min-h-dvh w-dvw flex items-center justify-center">
        <span className="loading loading-ring w-20 h-20"></span>
      </div>
    );
  }
  return (
    <div className="pt-24 max-h-dvh overflow-y-scroll">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className=" rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,.4)] overflow-hidden mb-6 border border-base-content/20">
          <div className="bg-gradient-to-br from-primary to-secondary h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Team Logo */}
              <div className="flex-shrink-0">
                {data?.team?.teamLogo ? (
                  <img
                    src={data?.team?.teamLogo}
                    alt={data?.team?.teamName}
                    className="w-32 h-32 rounded-full shadow-[0px_0px_20px_rgba(0,0,0,1)] object-cover border border-base-content/50"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border border-base-content/20 shadow-[0px_0px_20px_rgba(0,0,0,1)] text-5xl font-extrabold flex items-center justify-center bg-info ">
                    {defaultAvatar(data?.team?.teamName)}
                  </div>
                )}
              </div>

              {/* Team Name */}
              <div className="flex-1 md:pb-8">
                <h1 className="text-3xl text-base-content/60 font-bold mb-2 capitalize">
                  {data?.team?.teamName}
                </h1>
                {data?.team?.city && (
                  <div className="flex items-center gap-2 text-base-content/60 capitalize">
                    <MapPin className="w-4 h-4" />
                    <span className="text-lg">{data?.team?.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Info Card */}
          <div className=" rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,.4)] p-6 border border-base-content/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield
                  strokeWidth={3}
                  className="badge badge-soft badge-info  text-blue-600 h-9"
                />
              </div>
              <h2 className="text-lg font-semibold text-base-content/60">
                Team Admin
              </h2>
            </div>
            <div className="space-y-3">
              {data?.team?.adminName && (
                <div>
                  <p className="text-sm text-base-content/60 mb-1">Name</p>
                  <p className="text-base font-medium text-base-content/80 capitalize">
                    {data?.team?.adminName}
                  </p>
                </div>
              )}

              {canSeeAdminNumber && data?.team?.adminNumber && (
                <div>
                  <p className="text-sm text-base-content/60 mb-1">
                    Contact Number
                  </p>

                  <p className="text-base font-medium text-base-content/80">
                    {data?.team?.adminNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Team Details Card */}
          <div className="rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,.4)] p-6 border border-base-content/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Hash className="badge badge-soft badge-info  text-blue-600 h-9" />
              </div>
              <h2 className="text-lg font-semibold text-base-content/60">
                Team Details
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-base-content/60 mb-1">Team ID</p>
                <p className="text-base font-medium text-base-content/80 font-mono">
                  {teamId}
                </p>
              </div>
              {data?.team?.city && (
                <div>
                  <p className="text-sm text-base-content/60 mb-1">Location</p>
                  <p className="text-base font-medium text-base-content/80">
                    {data?.team?.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
