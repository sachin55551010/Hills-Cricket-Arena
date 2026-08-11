import { Link, useParams } from "react-router-dom";
import noData from "../../../assets/undraw_no-data.svg";
import { useSelector } from "react-redux";
import { useGetTeamsByTournamentQuery } from "../../store/teamApi";
import { TeamList } from "../../components/TeamList";
import { DummyListLoadingSkelton } from "../../components/modals/DummyLoadingSkelton";
export const MyTournamentTeams = () => {
  const { tournamentId } = useParams();

  const { authUser } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetTeamsByTournamentQuery(tournamentId);

  const myTournamentTeams = data?.myTournamentTeams ?? [];

  //dummy skelton when data is loading
  if (isLoading) {
    return (
      <div className="pt-26 max-h-dvh min-h-dvh p-4">
        {/* loading sceleton  */}
        <DummyListLoadingSkelton />
      </div>
    );
  }
  return (
    <div className="max-h-dvh min-h-dvh pt-22 overflow-y-scroll">
      {myTournamentTeams?.length > 0 && (
        <div className="flex justify-between items-center px-4 mt-4 py-6 bg-base-200 mx-3 rounded-lg">
          <p className="text-[.75rem] font-semibold">
            Want to add your team in this tournament ?
          </p>

          {authUser ? (
            <Link to="create-team">
              <button className="btn btn-info">Create</button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="btn btn-outline btn-info">Log in first</button>
            </Link>
          )}
        </div>
      )}
      {myTournamentTeams.length === 0 ? (
        // if no data
        <div className="flex flex-col min-h-[85dvh] items-center justify-center gap-4">
          <img src={noData} alt="" className="h-60 w-60" />
          <p className="font-bold">No Team data found !</p>

          {authUser ? (
            <Link to="create-team">
              <button className="btn btn-soft btn-info">Add Team</button>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span>Please login first to add your team</span>
              <Link to="/login">
                <button className="btn btn-soft btn-info w-50">Login</button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        //  teams List
        <TeamList data={data} tournamentId={tournamentId} />
      )}
    </div>
  );
};
