import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetInviteDataQuery,
  useValidateInviteLinkMutation,
} from "../../store/inviteTeamLinkApi";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Calendar, MapPin, Trophy } from "lucide-react";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import { useGetTeamsByTournamentQuery } from "../../store/teamApi";
import accessDenied from "../../../assets/access_denied.svg";
export const JoinTeamPage = () => {
  const location = useLocation();
  const { token } = useParams();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  const [joinTeamLink, { isLoading }] = useValidateInviteLinkMutation();
  const { data, isLoading: inviteDataLoading } = useGetInviteDataQuery(token);

  useEffect(() => {
    if (!authUser) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [authUser, location]);

  const { data: team } = useGetTeamsByTournamentQuery(data?.tournamentId?._id);

  // handle join team function

  const handleJoinTeamBtn = async () => {
    try {
      await joinTeamLink(token).unwrap();
      navigate(`/my-tournament/${data?.tournamentId?._id}/tournament-teams`);
    } catch (error) {
      console.log(error);
    }
  };

  // format date into text
  const options = { day: "2-digit", month: "short", year: "numeric" };

  if (!inviteDataLoading && !data) {
    return (
      <div className="fixed inset-0 z-[999] h-dvh bg-base-100 flex items-center justify-center flex-col gap-2 p-6">
        <img src={accessDenied} alt="Error" className="h-70 w-auto" />
        <h1 className="font-bold text-xl">Invalid or expired Link !</h1>
        <p className="">
          Ask your team admin or organiser to generate a new request add link
        </p>
        <Link className="btn btn-success w-full md:w-[40%]" to="/">
          <button>Go Back Home</button>
        </Link>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[999] h-dvh flex bg-base-100 justify-center overflow-y-scroll">
      <div className="border border-base-content/10 my-3 w-[95%] md:w-[70%] rounded-md flex flex-col items-center h-fit">
        {/* header */}
        <header className="bg-gradient-to-br from-primary to-secondary w-full min-h-40 rounded-t-md flex flex-col items-center justify-center p-2 gap-2">
          <Trophy size={60} />
          <h1 className="font-bold text-xl">Team Invitation</h1>
        </header>

        {/* invitation information */}
        <div className="w-full p-3">
          {/* admin details */}
          <section className="flex shadow-[0px_0px_5px_rgba(0,0,0,.5)] rounded-lg p-4 gap-4 items-center">
            {/* profile picture */}
            <div className="">
              {data?.createdBy?.profilePicture === "" ? (
                <div className="h-15 w-15 rounded-full bg-accent flex items-center justify-center font-extrabold text-xl">
                  {defaultAvatar(data?.createdBy?.playerName)}
                </div>
              ) : (
                <img
                  src={data?.createdBy?.profilePicture}
                  alt=""
                  className="h-15 w-15 object-cover rounded-full"
                />
              )}
            </div>

            {/* heading, name */}
            <div>
              <h1 className="text-base-content/40 font-semibold">
                You are invited by
              </h1>
              <h1 className="font-bold">{data?.createdBy?.playerName}</h1>
            </div>
          </section>
          {/* team name */}
          <section className="flex mt-4 flex-col shadow-[0px_0px_5px_rgba(0,0,0,.5)] rounded-lg p-4">
            <h4 className="text-base-content/40 font-semibold">Team Name</h4>
            <h1 className="font-bold capitalize text-lg">
              {data?.teamId?.teamName}
            </h1>
          </section>

          {/* tournament info section */}
          <section>
            <div className="mt-4 p-4 rounded-lg shadow-[0px_0px_5px_rgba(0,0,0,.5)]">
              <h1 className="text-base-content/40 font-semibold">
                Tournament Name
              </h1>
              <h1 className="text-xl font-extrabold capitalize">
                {data?.tournamentId?.tournamentName}
              </h1>

              {/* start and end date */}
              <div className="mt-6 flex justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={22} />
                  <div>
                    <h4 className="text-base-content/40 font-bold">
                      Start Date
                    </h4>
                    {data?.tournamentId?.startDate ? (
                      <h4 className="text-sm">
                        {new Date(
                          data?.tournamentId?.startDate,
                        ).toLocaleDateString("en", options)}
                      </h4>
                    ) : (
                      <span>_</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={22} />
                  <div>
                    <h4 className="text-base-content/40 font-bold">End Date</h4>
                    {data?.tournamentId?.endDate ? (
                      <h4 className="text-sm">
                        {new Date(
                          data?.tournamentId?.endDate,
                        ).toLocaleDateString("en", options)}
                      </h4>
                    ) : (
                      <span>_</span>
                    )}
                  </div>
                </div>
              </div>

              {/* location of event */}
              <div>
                <div className="mt-6 flex gap-2 items-center">
                  <MapPin />
                  <h1 className="text-base-content/40 font-bold">Location</h1>
                </div>
                <div className="flex gap-2 mt-2">
                  <h1 className="capitalize">{data?.tournamentId?.city},</h1>
                  <h1 className="capitalize">{data?.tournamentId?.ground}</h1>
                </div>
              </div>

              {/* team counts */}
              <div className="flex items-center gap-2 mt-6">
                <h1 className="font-bold">Total teams : </h1>
                <span className="font-bold">{team?.countTeams}</span>
              </div>
            </div>
            {/* join or decline button */}
            <div className="flex mt-6 gap-3">
              {!authUser ? (
                <Link to="/login" className="btn btn-info w-full font-bold">
                  <button>Please Login first</button>
                </Link>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleJoinTeamBtn}
                    className="btn btn-info flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-dots loading-xl"></span>
                    ) : (
                      "Join Team"
                    )}
                  </button>
                  <Link className="btn btn-error flex-1" to="/">
                    <button disabled={isLoading}>Decline</button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
