import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedStatus }) => {
  const storedMatch = localStorage.getItem("currentMatch");

  let match = null;

  try {
    match = storedMatch ? JSON.parse(storedMatch) : null;
  } catch (error) {
    console.error("Invalid currentMatch in localStorage:", error);
  }

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
        // Already in scoring status, so allow the route
        return <Outlet />;

      default:
        return <Navigate to="/local-match/setup" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
