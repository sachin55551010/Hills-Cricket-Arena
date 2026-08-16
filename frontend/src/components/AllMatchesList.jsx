import { useGetAllMatchesQuery } from "../store/matchApi";
import { DummyCardLoadingSkelton } from "../components/modals/DummyLoadingSkelton";
import noData from "../../assets/No data-amico.svg";
import { MapPin, Trophy, Calendar, Clock } from "lucide-react";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import { useEffect } from "react";
import { getSocket } from "../utils/socket";
import { useDispatch } from "react-redux";
import { tournamentApi } from "../store/tournamentApi";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {motion} from "motion/react"
import { NoDataFoundPage } from "./NoDataFoundPage";

/**
 *
 *  this compoent will display on all the match list
 * it will show matches according to category
 */
export const AllMatchesList = () => {
  const tournamentCategory = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllMatchesQuery(tournamentCategory);

  const allMatches = data?.allMatches ?? [];

  const dispatch = useDispatch();
  // Dynamic badge color
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
        return "badge-success badge-soft";
      case "completed":
        return "badge-success badge-soft";
      case "abandoned":
        return "badge-warning badge-soft";
      case "scheduled":
        return "badge-warning badge-soft";
      default:
        return "badge-ghost";
    }
  };

  useEffect(() => {
    const socket = getSocket();

    const handleNewMatch = (newMatch) => {
      dispatch(
        tournamentApi.util.updateQueryData(
          "getAllMatches",
          tournamentCategory,
          (draft) => {
            if (!draft?.allMatches) return;

            const exists = draft.allMatches.some((m) => m._id === newMatch._id);

            if (!exists) {
              draft.allMatches.unshift(newMatch);
            }
          },
        ),
      );
    };

    socket.on("newMatch", handleNewMatch);

    // cleanup to prevent duplicate listeners
    return () => {
      socket.off("newMatch", handleNewMatch);
    };
  }, [dispatch, tournamentCategory]);

  const noMatches = !allMatches || allMatches.length === 0;

  if (isLoading) {
    return <DummyCardLoadingSkelton />;
  }

  // handle match click button
  const handleMatchClickBtn = (match) => {
    navigate(`/match/${match?._id}`);
  };

  return (
    <div className="p-2 overflow-y-scroll">
      {noMatches && (
        <div className="relative h-[50%] w-full flex flex-col items-center justify-center overflow-hidden">
  {/* Soft background glow */}
  <div className="absolute h-72 w-72 rounded-full" />

  <NoDataFoundPage image={noData} title="No Match Found" description="There are no match available right now."/>
</div>
      )}
      <ul className="pt-4 pb-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMatches.map((match) => (
          <div
            onClick={() => handleMatchClickBtn(match)}
            key={match._id}
            className="bg-base-100 border border-base-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-base-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy size={15} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-base-content truncate">
                    {match.tournamentId?.tournamentName}
                  </h3>
                </div>
                <span
                  className={`flex-shrink-0 badge badge-sm ${getStatusStyle(match.status)}`}
                >
                  {match.status}
                </span>
              </div>

              {/* City & Ground */}
              <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-base-content/60">
                  <MapPin size={12} className="text-base-content/40" />
                  <span className="font-medium text-base-content/80">
                    City:
                  </span>
                  <span>{match.tournamentId?.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-base-content/60">
                  <MapPin size={12} className="opacity-0" />
                  <span className="font-medium text-base-content/80">
                    Ground:
                  </span>
                  <span>{match.tournamentId?.ground}</span>
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="px-5 py-5">
              <div className="flex items-center justify-between gap-2">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  {match.firstTeamId?.teamLogo ? (
                    <img
                      src={match.firstTeamId.teamLogo}
                      alt={match.firstTeamId.teamName}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-base-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-base-200">
                      {defaultAvatar(match.firstTeamId?.teamName)}
                    </div>
                  )}
                  <p className="text-xs font-semibold text-base-content text-center leading-tight max-w-[80px]">
                    {match.firstTeamId?.teamName}
                  </p>
                </div>

                {/* VS Divider */}
                <span className="text-xs font-bold text-base-content/30 tracking-widest">
                  VS
                </span>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  {match.secondTeamId?.teamLogo ? (
                    <img
                      src={match.secondTeamId.teamLogo}
                      alt={match.secondTeamId.teamName}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-base-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm ring-2 ring-base-200">
                      {defaultAvatar(match.secondTeamId?.teamName)}
                    </div>
                  )}
                  <p className="text-xs font-semibold text-base-content text-center leading-tight max-w-[80px]">
                    {match.secondTeamId?.teamName}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer — Date, Round & Overs */}
            <div className="px-5 py-3 bg-base-200/50 flex items-center justify-between gap-2 text-xs text-base-content/50">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span>
                  {new Date(match.matchScheduleDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {match.round && (
                  <span className="badge badge-soft badge-info text-[.8rem]">
                    {match.round}
                  </span>
                )}
                {match.overs && (
                  <span className="badge badge-soft badge-info text-[.8rem]">
                    Overs : {match.overs}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
