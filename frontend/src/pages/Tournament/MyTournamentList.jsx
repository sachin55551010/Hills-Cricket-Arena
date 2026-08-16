import { DummyCardLoadingSkelton } from "../../components/modals/DummyLoadingSkelton";
import { useGetMyTournamentQuery } from "../../store/tournamentApi";
import { useNavigate } from "react-router-dom";
import noData from "../../../assets/No data-amico.svg";
// eslint-disable-next-line no-unused-vars
import {motion} from "motion/react"
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
            <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2 lg:grid-cols-3">
              {data?.myTournaments?.map((tournament) => {
                return (
                  <div
                    onClick={() => handleOnClickBtn(tournament._id)}
                    key={tournament._id}
                    className="group relative flex flex-col rounded-2xl h-50 bg-base-100 cursor-pointer border border-base-content/8 hover:border-base-content/20 hover:shadow-lg hover:shadow-base-content/5 transition-all duration-300"
                  >
                    {/* header */}
                    <div className="flex-1 p-5 flex flex-col justify-end">
                      <span className="absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full bg-warning/15 text-warning border border-warning/25 tracking-wide uppercase">
                        {tournament.status}
                      </span>
                      <h1 className="font-semibold text-base capitalize text-base-content leading-snug">
                        {tournament.tournamentName}
                      </h1>
                    </div>

                    {/* footer */}
                    <div className="px-5 py-3 border-t border-base-content/6 flex justify-between items-center text-xs text-base-content/40 font-medium">
                      <span className="capitalize">
                        {tournament.city} · {tournament.ground}
                      </span>
                      <span>
                        {new Date(tournament.createdAt).toLocaleDateString(
                          "en",
                          options,
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
