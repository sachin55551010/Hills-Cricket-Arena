import { Header } from "../components/Header";
import { MyTournamentList } from "../pages/Tournament/MyTournamentList";

export const OrganiserDashBoard = () => {
  return (
    <div className="max-h-dvh">
      <Header data="My Tournaments" backTo="/" />
      <MyTournamentList />
    </div>
  );
};
