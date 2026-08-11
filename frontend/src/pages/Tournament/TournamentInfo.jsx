import { useParams, NavLink, Outlet } from "react-router-dom";
import { useGetTournamentInfoQuery } from "../../store/tournamentApi";
import { Header } from "../../components/Header";

export const TournamentInfo = () => {
  const { tournamentId } = useParams();
  const { data, isLoading, isError } = useGetTournamentInfoQuery(tournamentId);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Something went wrong...</h1>;
  }

  return (
    <div className="">
      <Header data={data?.myTournament?.tournamentName} />
      <nav className="fixed z-[998] w-full bg-base-200 pt-14 flex justify-around">
        <NavLink
          to="tournament-info"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Info
        </NavLink>
        <NavLink
          to="tournament-teams"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Teams
        </NavLink>
        <NavLink
          to="tournament-matches"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Matches
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};
