import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/User/LoginPage";
import { useSelector } from "react-redux";
import { useCheckAuthUserQuery } from "./store/authApi";
import { ProfilePage } from "./pages/User/ProfilePage";
import { ToastContainer } from "react-toastify";
import { CareerStats } from "./pages/User/CareerStats";
import { EditProfile } from "./pages/User/EditProfile";
import { CreateTournamentPage } from "./pages/Tournament/CreateTournamentPage";
import { TournamentInfo } from "./pages/Tournament/TournamentInfo";
import { MyTournamentInfo } from "./pages/Tournament/MyTournamentInfo";
import { MyTournamentTeams } from "./pages/Team/MyTournamentTeams";
import { MyTournamentMatches } from "./pages/Match/MyTournamentMatches";
import { AllTournaments } from "./pages/Tournament/AllTournaments";
import { AllOpenTournaments } from "./pages/Tournament/AllOpenTournaments";
import { AllPanchayatTournaments } from "./pages/Tournament/AllPanchayatTournaments";
import { AllPanchayatOpenTournament } from "./pages/Tournament/AllPanchayatOpenTournament";
import { AllCorporateTournament } from "./pages/Tournament/AllCorporateTournament";
import { NavBar } from "./components/NavBar";
import { ChangeTheme } from "./components/ChangeTheme";
import { UserDashBoard } from "./dashboard/UserDashBoard";
import { OrganiserDashBoard } from "./dashboard/OrganiserDashBoard";
import { createSocket } from "./utils/socket";
import { NotFound } from "./pages/NotFound";
import { CreateTeam } from "./pages/Team/CreateTeam";
import { AddTeamPlayer } from "./pages/Team/AddTeamPlayer";
import { JoinTeamPage } from "./pages/Team/JoinTeamPage";
import { useEffect } from "react";
import { StartMatch } from "./pages/Match/StartMatch";
import { TeamInfo } from "./pages/Team/TeamInfo";
import { TeamInfoPage } from "./pages/Team/TeamInfoPage";
import { AllOpenMatches } from "./pages/Match/AllOpenMatches";
import { AllPanchayatMatches } from "./pages/Match/AllPanchayatMatches";
import { AllPanchayatOpenMatches } from "./pages/Match/AllPanchayatOpenMatches";
import { AllCorporateMatches } from "./pages/Match/AllCorporateMatches";
import { AllMatches } from "./pages/Match/Allmatches";
import { CricketLoader } from "./ui/CricketLoader";
import { MatchInfo } from "./pages/Match/MatchInfo";
import { LiveMatch } from "./pages/Match/LiveMatch";
import { MatchSquad } from "./pages/Match/MatchSquad";
import { ScoreCard } from "./pages/Match/ScoreCard";
import { MatchInfoPage } from "./components/MatchInfoPage";
function App() {
  const { authUser } = useSelector((state) => state.auth);
  const { isLoading } = useCheckAuthUserQuery();
  const { myTheme } = useSelector((state) => state.theme);
  const { chooseTheme } = useSelector((state) => state.theme);

  const socket = createSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:");
    });
  }, [socket]);

  const navigate = useNavigate();
  useEffect(() => {
    const redirectTo = localStorage.getItem("redirectAfterLogin");

    if (authUser && redirectTo) {
      navigate(redirectTo);
      localStorage.removeItem("redirectAfterLogin");
    }
  }, [authUser, navigate]);
  //
  if (isLoading && !authUser) {
    return <CricketLoader />;
  }

  return (
    <div data-theme={myTheme} className={`min-h-dvh`}>
      <div className={`${chooseTheme && "blur-sm overflow-hidden"}`}>
        <NavBar />

        {/* routes  */}
        <Routes>
          {/*
           * user dashboard // app main page
           * contain home page
           * contain all tournament page
           * contain all matches page
           */}
          <Route path="/" element={<UserDashBoard />}>
            <Route index element={<HomePage />} />
            {/*
            all nested tourments routes inside user dashboard
            * contain all open tournament page
            * contain all panchayat tournament page
            * contain all panchayat+open tournament page
            * contain all corporate tournament page
            */}
            <Route path="all-tournaments" element={<AllTournaments />}>
              <Route index element={<Navigate to="open" replace />} />
              <Route path="open" element={<AllOpenTournaments />} />
              <Route path="panchayat" element={<AllPanchayatTournaments />} />
              <Route
                path="panchayat+open"
                element={<AllPanchayatOpenTournament />}
              />
              <Route path="corporate" element={<AllCorporateTournament />} />
            </Route>

            {/*
            all nested matches routes
            */}
            <Route path="all-matches" element={<AllMatches />}>
              <Route index element={<Navigate to="open" replace />} />
              <Route path="open" element={<AllOpenMatches />} />
              <Route path="panchayat" element={<AllPanchayatMatches />} />
              <Route
                path="panchayat+open"
                element={<AllPanchayatOpenMatches />}
              />
              <Route path="corporate" element={<AllCorporateMatches />} />
            </Route>
          </Route>
          {/* login page  */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          {/*
          organiser dashboard
          containes info matches and  teams routes
          */}
          <Route
            path="/my-tournament"
            element={
              authUser?.player?.role === "organiser" && <OrganiserDashBoard />
            }
          />
          {/* my profile page  */}
          <Route path="/profile/:playerId" element={<ProfilePage />} />
          {/* player career stats page  */}
          <Route
            path="/profile/career-stats/:playerId"
            element={<CareerStats />}
          />
          {/*
           edit profile page
           to edit name, age, gender, profile photo etc
            */}
          <Route
            path="/profile/edit-profile/:playerId"
            element={authUser && <EditProfile />}
          />
          {/*
            all routes related with tournaments actions like create edit delete
           */}
          <Route
            path="/add-tournament"
            element={
              authUser ? (
                <CreateTournamentPage mode="create" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/update-tournament/:tournamentId"
            element={
              authUser ? (
                <CreateTournamentPage mode="edit" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/*
           * routes for specific tournament
           * contain tournament info page
           * contain matches info page
           * contain teams info page
           */}
          <Route
            path="/my-tournament/:tournamentId"
            element={<TournamentInfo />}
          >
            // create team route
            <Route
              path="tournament-teams/create-team"
              element={authUser && <CreateTeam mode="create" />}
            />
            //edit team route
            <Route
              path="tournament-teams/update-team/:teamId"
              element={authUser && <CreateTeam mode="edit" />}
            />
            <Route path="tournament-teams" element={<MyTournamentTeams />} />
            <Route index element={<Navigate to="tournament-info" replace />} />
            <Route path="tournament-info" element={<MyTournamentInfo />} />
            <Route
              path="tournament-matches"
              element={<MyTournamentMatches />}
            />
            <Route
              path="tournament-matches/start"
              element={authUser && <StartMatch mode="start" />}
            />
            <Route
              path="tournament-matches/schedule"
              element={authUser && <StartMatch mode="schedule" />}
            />
            {/*
            team info routes
            contain team info page
            contain add team players page
             */}
            <Route path="tournament-teams/:teamId" element={<TeamInfo />}>
              <Route index element={<Navigate to="team-info" replace />} />
              <Route path="team-info" element={<TeamInfoPage />} />
              <Route path="add-players" element={<AddTeamPlayer />} />
              <Route
                path="team-players"
                element={<div>Team Players Component</div>}
              />
              <Route
                path="team-info"
                element={<div>Team Info Component</div>}
              />
            </Route>
          </Route>
          {/* all routes related with matches actions like live match, scorecard,
          match info, match squad*/}
          {/* Specific match routes */}
          <Route path="/match/:matchId" element={<MatchInfoPage />}>
            {/* Default page */}
            <Route index element={<Navigate to="info" replace />} />

            {/* Match information */}
            <Route path="info" element={<MatchInfo />} />

            {/* Live match */}
            <Route path="live" element={<LiveMatch />} />

            {/* Scorecard */}
            <Route path="scorecard" element={<ScoreCard />} />

            {/* Match squad */}
            <Route path="squad" element={<MatchSquad />} />
          </Route>
          <Route path="/all-tournaments" element={<AllTournaments />} />
          {/* team join route */}
          <Route path="/join-team/:token" element={<JoinTeamPage />} />
          {/* for invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {chooseTheme && <ChangeTheme />}
      <ToastContainer />
    </div>
  );
}

export default App;
