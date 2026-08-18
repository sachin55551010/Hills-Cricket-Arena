import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedStatus, children }) => {
  const match = JSON.parse(localStorage.getItem("matchData"));

  if (!match) {
    return <Navigate to="/match/setup" replace />;
  }

  if (match.status !== allowedStatus) {
    switch (match.status) {
      case "":
        return <Navigate to="/match/setup" replace />;

      case "players":
        return <Navigate to="/match/players" replace />;

      case "scoring":
        return <Navigate to="/match/scoring" replace />;

      default:
        return <Navigate to="/match/setup" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
