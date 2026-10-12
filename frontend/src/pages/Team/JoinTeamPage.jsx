import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetInviteDataQuery,
  useValidateInviteLinkMutation,
} from "../../store/inviteTeamLinkApi";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
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

  const handleJoinTeamBtn = async () => {
    try {
      await joinTeamLink(token).unwrap();
      navigate(`/my-tournament/${data?.tournamentId?._id}/tournament-teams`);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (inviteDataLoading) {
    return (
      <main className="fixed inset-0 z-[999] flex min-h-dvh items-center justify-center bg-base-200/60 p-6">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="sr-only">Loading invitation</span>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="fixed inset-0 z-[999] flex min-h-dvh items-center justify-center overflow-y-auto bg-base-200/60 p-5">
        <section className="w-full max-w-md rounded-2xl border border-base-content/10 bg-base-100 p-8 text-center shadow-sm">
          <img
            src={accessDenied}
            alt=""
            className="mx-auto mb-6 h-36 w-auto"
          />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">
            Invitation unavailable
          </p>
          <h1 className="text-2xl font-bold">This link can’t be used</h1>
          <p className="mt-3 text-sm leading-6 text-base-content/60">
            Ask your team admin or organiser to send you a new invitation link.
          </p>
          <Link className="btn btn-primary mt-7 w-full" to="/">
            Go back home
          </Link>
        </section>
      </main>
    );
  }

  const profilePicture = data.createdBy?.profilePicture;

  return (
    <main className="fixed inset-0 z-[999] flex min-h-dvh justify-center overflow-y-auto bg-base-200/60 px-4 py-8 sm:items-center sm:py-10">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-xl shadow-base-content/5">
        <header className="border-b border-base-content/10 px-6 py-7 sm:px-9 sm:py-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-primary">
            <Trophy size={23} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">
            Team invitation
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            You’re invited to join
          </h1>
          <p className="mt-2 text-base-content/60">
            Review the details below and join the team when you’re ready.
          </p>
        </header>

        <div className="space-y-6 px-6 py-6 sm:px-9 sm:py-8">
          <section
            aria-label="Invitation details"
            className="flex items-center gap-4 rounded-xl border border-base-content/10 bg-base-200/40 p-4 sm:p-5"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-base-300 text-lg font-bold">
                {defaultAvatar(data.createdBy?.playerName)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-base-content/55">Invited by</p>
              <p className="truncate font-semibold">
                {data.createdBy?.playerName}
              </p>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-sm font-medium text-base-content/55">
                Your team
              </p>
              <h2 className="mt-1 text-xl font-bold capitalize sm:text-2xl">
                {data.teamId?.teamName}
              </h2>
            </div>

            <div className="rounded-xl border border-base-content/10 p-4 sm:p-5">
              <p className="text-sm font-medium text-base-content/55">
                Tournament
              </p>
              <h3 className="mt-1 text-lg font-semibold capitalize">
                {data.tournamentId?.tournamentName}
              </h3>

              <div className="mt-5 grid gap-4 border-t border-base-content/10 pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-0.5 shrink-0 text-base-content/50"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-medium text-base-content/50">
                      Dates
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {data.tournamentId?.startDate
                        ? formatDate(data.tournamentId.startDate)
                        : "TBD"}
                      <span className="mx-2 text-base-content/35">—</span>
                      {data.tournamentId?.endDate
                        ? formatDate(data.tournamentId.endDate)
                        : "TBD"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-base-content/50"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-medium text-base-content/50">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-medium capitalize">
                      {[data.tournamentId?.city, data.tournamentId?.ground]
                        .filter(Boolean)
                        .join(", ") || "To be announced"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <Users size={17} aria-hidden="true" />
              <span>
                <strong className="font-semibold text-base-content">
                  {team?.countTeams ?? "—"}
                </strong>{" "}
                teams in this tournament
              </span>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-base-content/10 pt-5 sm:flex-row">
            {authUser ? (
              <>
                <Link
                  className={`btn btn-ghost flex-1 ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                  to="/"
                  aria-disabled={isLoading}
                >
                  Decline
                </Link>
                <button
                  onClick={handleJoinTeamBtn}
                  className="btn btn-primary flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Joining...
                    </>
                  ) : (
                    "Join team"
                  )}
                </button>
              </>
            ) : (
              <Link className="btn btn-primary w-full" to="/login">
                Log in to join
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
