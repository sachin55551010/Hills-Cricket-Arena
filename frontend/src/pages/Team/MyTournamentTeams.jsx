import { Link, useParams } from "react-router-dom";
import noData from "../../../assets/undraw_no-data.svg";
import { useSelector } from "react-redux";
import { useGetTeamsByTournamentQuery } from "../../store/teamApi";
import { TeamList } from "../../components/TeamList";
import { DummyListLoadingSkelton } from "../../components/modals/DummyLoadingSkelton";
import { NoDataFoundPage } from "../../components/NoDataFoundPage";
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
        <div className="mx-3 mt-4 flex items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-200/60 px-4 py-4 shadow-sm backdrop-blur-sm">
  <p className="text-sm font-medium text-base-content/80">
    Want to add your team to this tournament?
  </p>

  {authUser ? (
    <Link to="create-team">
      <button className="btn btn-info btn-sm rounded-lg px-5 shadow-sm">
        Create
      </button>
    </Link>
  ) : (
    <Link to="/login">
      <button className="btn btn-outline btn-info btn-sm rounded-lg px-4">
        Log in first
      </button>
    </Link>
  )}
</div>
      )}
      {myTournamentTeams.length === 0 ? (
        // if no data
        <div className="flex flex-col min-h-[85dvh] items-center justify-center gap-4">
          <div>
            <NoDataFoundPage image={noData} title="No team data found" description="There are no team data available right now."/>
          </div>
          

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
