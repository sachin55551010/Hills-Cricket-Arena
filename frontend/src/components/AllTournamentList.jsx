import { useDispatch } from "react-redux";
import { getSocket } from "../utils/socket";
import { useEffect, useMemo } from "react";
import noData from "../../assets/No data-amico.svg";
// eslint-disable-next-line no-unused-vars
import {motion} from "motion/react"
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import {
  tournamentApi,
  useGetAllTournamentsQuery,
} from "../store/tournamentApi";
import { DummyCardLoadingSkelton } from "./modals/DummyLoadingSkelton";
import { Phone, User } from "lucide-react";
import { NoDataFoundPage } from "./NoDataFoundPage";

export const AllTournamentList = () => {
  const { searchData } = useOutletContext();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const tournamentCategory = location.pathname.split("/").pop();

  // ✅ Stable query args (IMPORTANT)
  const queryArgs = useMemo(
    () => ({
      tournamentCategory,
      searchData,
    }),
    [tournamentCategory, searchData],
  );

  const { data, isLoading } = useGetAllTournamentsQuery(queryArgs);

  useEffect(() => {
    const socket = getSocket();

    // 🔥 NEW TOURNAMENT
    socket.on("newTournament", (newTournament) => {
      dispatch(
        tournamentApi.util.updateQueryData(
          "getAllTournaments",
          queryArgs,
          (draft) => {
            if (!draft?.allTournaments) return;

            // Optional: prevent duplicate insert
            const exists = draft.allTournaments.some(
              (t) => t._id === newTournament._id,
            );
            if (!exists) {
              draft.allTournaments.unshift(newTournament);
            }
          },
        ),
      );
    });

    // 🔥 DELETE TOURNAMENT
    socket.on("deletedTournament", (deletedId) => {
      dispatch(
        tournamentApi.util.updateQueryData(
          "getAllTournaments",
          queryArgs,
          (draft) => {
            if (!draft?.allTournaments) return;

            draft.allTournaments = draft.allTournaments.filter(
              (t) => t._id !== deletedId,
            );
          },
        ),
      );
    });

    // 🔥 UPDATE TOURNAMENT
    socket.on("updatedTournament", (updatedTournament) => {
      dispatch(
        tournamentApi.util.updateQueryData(
          "getAllTournaments",
          queryArgs,
          (draft) => {
            if (!draft?.allTournaments) return;

            const index = draft.allTournaments.findIndex(
              (t) => t._id === updatedTournament._id,
            );

            if (index !== -1) {
              draft.allTournaments[index] = updatedTournament;
            }
          },
        ),
      );
    });

    return () => {
      socket.off("newTournament");
      socket.off("deletedTournament");
      socket.off("updatedTournament");
    };
  }, [dispatch, queryArgs]);

  const tournamentStatusColor = {
    Upcoming: "badge-info",
    Ongoing: "badge-warning",
    Completed: "badge-success",
    Cancelled: "badge-warning",
    Abandoned: "badge-error",
    Postponed: "badge-neutral",
    Inactive: "badge-error",
  };

  const handleGetTournamentInfoBtn = (tournamentId) => {
    navigate(`/my-tournament/${tournamentId}`);
  };

  const options = { day: "2-digit", month: "short", year: "numeric" };

  if (isLoading) {
    return (
      <div className="mt-10">
        <DummyCardLoadingSkelton />
      </div>
    );
  }

  const noTournaments =
    !data?.allTournaments || data.allTournaments.length === 0;

  return (
    <>
      {noTournaments && (
        <div className="relative h-[50%] w-full flex flex-col items-center justify-center overflow-hidden">
 
  <div className="" />
  <NoDataFoundPage image={noData} title="No Tournament Found" description="There are no tournaments available right now."/>
</div>

      )}

      <ul className="grid px-3 py-4 gap-3 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.allTournaments?.map((tournament) => (
          <li
            onClick={() => handleGetTournamentInfoBtn(tournament._id)}
            key={tournament._id}
            className="relative flex flex-col rounded-xl h-55 bg-base-100 cursor-pointer border border-base-content/10 hover:border-base-content/30 hover:shadow-lg transition-all duration-200"
          >
            {/* Header */}
            <div className="h-[70%] px-4 py-3 flex flex-col justify-around">
              <h1 className="text-sm font-semibold capitalize  tracking-tight badge badge-soft badge-info">
                {tournament.tournamentName}
              </h1>

              <div className="flex gap-2 text-[.7rem] text-base-content/50 items-center">
                <User size={13} />
                <span className="text-base-content/40">Organiser</span>
                <span className="font-medium text-base-content/70">
                  {tournament.organiserName}
                </span>
              </div>

              <div className="flex gap-2 text-[.7rem] text-base-content/50 items-center">
                <Phone size={13} />
                <span className="text-base-content/40">Contact</span>
                <span className="font-medium text-base-content/70">
                  {tournament.phone}
                </span>
              </div>

              <div className="flex justify-between text-[.7rem] text-base-content/50">
                <div className="flex gap-1 items-center">
                  <span className="text-base-content/40">Start</span>
                  <span className="font-medium text-base-content/70">
                    {tournament.startDate
                      ? new Date(tournament.startDate).toLocaleDateString(
                          "en",
                          options,
                        )
                      : "N/A"}
                  </span>
                </div>

                <div className="flex gap-1 items-center">
                  <span className="text-base-content/40">End</span>
                  <span className="font-medium text-base-content/70">
                    {tournament.endDate
                      ? new Date(tournament.endDate).toLocaleDateString(
                          "en",
                          options,
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div
                className={`absolute badge badge-soft ${
                  tournamentStatusColor[tournament.status]
                } top-3 right-3 text-[.65rem] font-medium rounded-full px-2`}
              >
                {tournament.status}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-base-content/8 flex flex-col gap-1.5 rounded-b-xl h-[30%] px-4 py-2.5 text-[.7rem] bg-base-200/40">
              <div className="flex gap-1 text-base-content/40 items-center">
                <span>Created</span>
                <span className="text-base-content/60 font-medium">
                  {new Date(tournament.createdAt).toLocaleDateString(
                    "en",
                    options,
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-1 items-center text-base-content/50 font-medium ">
                  <span className="text-base-content/35">City</span>
                  <span className="capitalize text-base-content/65">
                    {tournament.city}
                  </span>
                </div>

                <div className="flex gap-1 items-center text-base-content/50 font-medium">
                  <span className="text-base-content/35">Ground</span>
                  <span className="capitalize text-base-content/65">
                    {tournament.ground}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
