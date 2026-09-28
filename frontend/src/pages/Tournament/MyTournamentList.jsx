import { DummyCardLoadingSkelton } from "../../components/modals/DummyLoadingSkelton";
import { useGetMyTournamentQuery } from "../../store/tournamentApi";
import { useNavigate } from "react-router-dom";
import noData from "../../../assets/No data-amico.svg";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { Phone, User } from "lucide-react";
export const MyTournamentList = () => {
  const { data, isLoading } = useGetMyTournamentQuery();
  const navigate = useNavigate();

  // function to get tournament information related with tournament id
  const handleOnClickBtn = (tournamentId) => {
    navigate(`/my-tournament/${tournamentId}`);
  };
  //format date
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return (
    <div className="px-4 pt-20 pb-8 max-h-dvh overflow-y-scroll">
      {isLoading ? (
        <DummyCardLoadingSkelton />
      ) : (
        <div className="">
          {data?.myTournaments?.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
             <motion.div
                 className="relative mt-10"
                 initial={{ opacity: 0, scale: 0.7 }}
                 animate={{
                   opacity: 1,
                   scale: 1,
                   y: [0, -12, 0],
                 }}
                 transition={{
                   opacity: { duration: 0.6 },
                   scale: {
                     duration: 0.8,
                     ease: "backOut",
                   },
                   y: {
                     duration: 3.5,
                     repeat: Infinity,
                     ease: "easeInOut",
                   },
                 }}
               >
                 {/* Image glow */}
                 <div className="absolute inset-6 rounded-full" />
             
                 <img
                   src={noData}
                   alt="No tournament"
                   className="relative h-64 w-64 object-contain drop-shadow-xl sm:h-72 sm:w-72 md:h-80 md:w-80"
                 />
               </motion.div>
             
               {/* Text */}
               <motion.div
                 className="relative mt-2 flex flex-col items-center px-4 text-center"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{
                   duration: 0.7,
                   delay: 0.5,
                   ease: "easeOut",
                 }}
               >
                 <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                   No Tournaments Found
                 </h2>
             
                 <p className="mt-2 max-w-sm text-sm text-base-content/60 sm:text-base">
                   There are no tournaments available right now.
                 </p>
             
                 {/* Decorative dots */}
                 <div className="mt-5 flex items-center gap-1.5">
                   <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                   <span className="h-1.5 w-6 rounded-full bg-primary/60" />
                   <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                 </div>
               </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-2 lg:grid-cols-3">
              {data?.myTournaments?.map((tournament) => (
                <li
                  onClick={() => handleOnClickBtn(tournament._id)}
                  key={tournament._id}
                  className="relative flex flex-col rounded-xl h-55 bg-base-100 cursor-pointer border border-base-content/10 hover:border-base-content/30 hover:shadow-lg transition-all duration-200 list-none"
                >
                  {/* Status badge — top right */}
                  <div
                    className={`absolute badge badge-soft ${
                      {
                        Upcoming: "badge-info",
                        Ongoing: "badge-warning",
                        Completed: "badge-success",
                        Cancelled: "badge-warning",
                        Abandoned: "badge-error",
                        Postponed: "badge-neutral",
                        Inactive: "badge-error",
                      }[tournament.status]
                    } top-3 right-3 text-[.65rem] font-medium rounded-full px-2`}
                  >
                    {tournament.status}
                  </div>

                  {/* Body */}
                  <div className="h-[70%] px-4 py-3 flex flex-col justify-around">
                    <h1 className="text-sm font-semibold capitalize tracking-tight badge badge-soft badge-info">
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
                            ? new Date(tournament.startDate).toLocaleDateString("en", options)
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-base-content/40">End</span>
                        <span className="font-medium text-base-content/70">
                          {tournament.endDate
                            ? new Date(tournament.endDate).toLocaleDateString("en", options)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-base-content/8 flex flex-col gap-1.5 rounded-b-xl h-[30%] px-4 py-2.5 text-[.7rem] bg-base-200/40">
                    <div className="flex gap-1 text-base-content/40 items-center">
                      <span>Created</span>
                      <span className="text-base-content/60 font-medium">
                        {new Date(tournament.createdAt).toLocaleDateString("en", options)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1 items-center text-base-content/50 font-medium">
                        <span className="text-base-content/35">City</span>
                        <span className="capitalize text-base-content/65">{tournament.city}</span>
                      </div>
                      <div className="flex gap-1 items-center text-base-content/50 font-medium">
                        <span className="text-base-content/35">Ground</span>
                        <span className="capitalize text-base-content/65">{tournament.ground}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
