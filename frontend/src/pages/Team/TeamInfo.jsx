import { NavLink, Outlet, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { useGetTeamByIdQuery } from "../../store/teamApi";

export const TeamInfo = () => {
  const { teamId } = useParams();

  const { data: myTeamInfo } = useGetTeamByIdQuery(teamId);

  return (
    <div className="h-dvh">
      <Header data={myTeamInfo?.team?.teamName} />
      <nav className="fixed z-[998] w-full bg-base-200 pt-15 flex justify-around">
        <NavLink
          to="team-info"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Team Info
        </NavLink>
        <NavLink
          to="add-players"
          className={({ isActive }) =>
            `${
              isActive && "border-b-2 font-extrabold text-success"
            } text-center flex-1 pb-2`
          }
        >
          Team Players
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};
