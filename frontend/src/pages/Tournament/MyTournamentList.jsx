import { DummyCardLoadingSkelton } from "../../components/modals/DummyLoadingSkelton";
import { useGetMyTournamentQuery } from "../../store/tournamentApi";
import { useNavigate } from "react-router-dom";

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
            <div className="bg-red-400">
              <p>No Tournaments found</p>
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
