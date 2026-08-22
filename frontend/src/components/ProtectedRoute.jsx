import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedStatus, children }) => {
  const match = JSON.parse(localStorage.getItem("currentMatch")) || null;

  if (!match) {
    return <Navigate to="/local-match/setup" replace />;
  }

  if (match.status !== allowedStatus) {
    switch (match.status) {
      case "":
        return <Navigate to="/local-match/setup" replace />;

      case "players":
        return <Navigate to="/local-match/players" replace />;

      case "scoring":
        return <Navigate to="/local-match/scoring" replace />;

      default:
        return <Navigate to="/local-match/setup" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
