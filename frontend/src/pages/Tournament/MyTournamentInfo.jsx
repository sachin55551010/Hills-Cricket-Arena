import { useSelector } from "react-redux";
import { NavLink, useParams, Link } from "react-router-dom";
import { useGetTournamentInfoQuery } from "../../store/tournamentApi";
import {
  UserRoundPen,
  Shield,
  Trophy,
  Phone,
  Swords,
  Tag,
  CalendarDays,
  MapPin,
  CircleDot,
  LayoutGrid,
  Info,
  Settings,
} from "lucide-react";
import { defaultAvatar } from "../../utils/noprofilePicHelper";

export const MyTournamentInfo = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { tournamentId } = useParams();
  const { data, isLoading } = useGetTournamentInfoQuery(tournamentId);

  //format Date
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return (
    <div className="h-dvh bg-base-200/30 pt-26 pb-8 px-4 flex flex-col items-center overflow-y-scroll">
      <div className="w-full md:w-[65%] flex flex-col gap-6">
        {/* Organiser Detail */}
        <div className="rounded-2xl border border-base-content/10 bg-base-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-base-content/10 bg-base-50">
            <Shield size={14} className="text-base-content/40" />
            <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
              Organiser
            </span>
          </div>
          <Link to={`/profile/${data?.myTournament?.createdBy?._id}`}>
            <div className="flex items-center gap-5 px-5 py-6">
              {/* Profile Picture */}
              <div className="shrink-0">
                {data?.myTournament?.createdBy?.profilePicture === "" ? (
                  <div className="rounded-full h-16 w-16 flex items-center justify-center bg-primary/10 ring-2 ring-primary/20">
                    <span className="text-lg font-bold text-primary">
                      {defaultAvatar(data?.myTournament?.createdBy?.playerName)}
                    </span>
                  </div>
                ) : (
                  <img
                    className="rounded-full h-16 w-16 object-cover ring-2 ring-base-content/10"
                    src={data?.myTournament?.createdBy?.profilePicture}
                    alt=""
                  />
                )}
              </div>

              {/* Organiser Details */}
              <div className="flex flex-col gap-3 flex-1">
                <span className="font-bold text-base-content text-base">
                  {data?.myTournament?.createdBy?.playerName}
                </span>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-base-content/55">
                    <Trophy size={13} />
                    <span>Tournaments Organised:</span>
                    <span className="font-semibold text-base-content/80">
                      {data?.totalTournaments}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-base-content/55">
                    <Phone size={13} />
                    <span>Contact:</span>
                    <span className="font-semibold text-base-content/80">
                      {data?.myTournament?.createdBy?.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Tournament Detail */}
        {isLoading ? (
          <div className="skeleton h-60 w-full rounded-2xl"></div>
        ) : (
          <div className="rounded-2xl border border-base-content/10 bg-base-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-base-content/10 bg-base-50">
              <div className="flex items-center gap-2">
                <Swords size={14} className="text-base-content/40" />
                <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                  Tournament Detail
                </span>
              </div>
              {authUser?.player?._id === data?.myTournament?.createdBy?._id && (
                <NavLink
                  to={`/update-tournament/${tournamentId}`}
                  className="flex items-center gap-1.5 text-xs text-base-content/50 hover:text-primary transition-colors duration-200"
                >
                  <UserRoundPen size={15} />
                  <span>Edit</span>
                </NavLink>
              )}
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  <Tag size={11} />
                  <span>Name</span>
                </div>
                <span className="capitalize text-base-content font-medium">
                  {data?.myTournament?.tournamentName}
                </span>
              </div>

              {/* Dates */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  <CalendarDays size={11} />
                  <span>Tournament Dates</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-base-200/60 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-base-content/50 font-medium">
                      Start
                    </span>
                    <span className="text-sm text-base-content font-semibold">
                      {data?.myTournament?.startDate ? (
                        new Date(
                          data?.myTournament?.startDate.slice(0, 10),
                        ).toLocaleString("en", options)
                      ) : (
                        <span className="text-base-content/40 font-normal">
                          Not Mentioned
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-base-200/60 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-base-content/50 font-medium">
                      End
                    </span>
                    <span className="text-sm text-base-content font-semibold">
                      {data?.myTournament?.endDate ? (
                        new Date(
                          data?.myTournament?.endDate.slice(0, 10),
                        ).toLocaleString("en", options)
                      ) : (
                        <span className="text-base-content/40 font-normal">
                          Not Mentioned
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ground */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  <MapPin size={11} />
                  <span>Ground</span>
                </div>
                <span className="capitalize text-base-content font-medium">
                  {data?.myTournament?.city}, {data?.myTournament?.ground}
                </span>
              </div>

              {/* Ball Type */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  <CircleDot size={11} />
                  <span>Ball Type</span>
                </div>
                <span className="capitalize text-base-content font-medium">
                  {data?.myTournament?.ballType}
                </span>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  <LayoutGrid size={11} />
                  <span>Category</span>
                </div>
                <span className="capitalize text-base-content font-medium">
                  {data?.myTournament?.tournamentCategory}
                </span>
              </div>

              {/* Max Changes Allowed */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  <Settings size={11} />
                  <span>Max Changes Allowed</span>
                </div>
                <span className="capitalize text-base-content font-medium">
                  {data?.myTournament?.maxChangesAllowed || "Not Mentioned"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="rounded-2xl border border-base-content/10 bg-base-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-base-content/10 bg-base-50">
            <Info size={14} className="text-base-content/40" />
            <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
              Additional Information
            </span>
          </div>

          <div className="px-5 py-6">
            {data?.myTournament?.additionalInfo === "" ? (
              <p className="text-sm text-base-content/40 leading-relaxed italic">
                No information available yet. The organiser has not added
                details for this tournament. Once updated, you will be able to
                view entry fee, winning prize, rules, and other important
                information here.
              </p>
            ) : (
              <p className="capitalize font-semibold text-base-content/80 italic leading-relaxed">
                {data?.myTournament?.additionalInfo}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
