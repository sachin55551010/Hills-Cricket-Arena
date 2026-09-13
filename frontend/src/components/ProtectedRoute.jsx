import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedStatus, children }) => {
  const storedMatch = localStorage.getItem("currentMatch");

  let match = null;

  try {
    match = storedMatch ? JSON.parse(storedMatch) : null;
  } catch (error) {
    console.error("Invalid currentMatch in localStorage:", error);
  }

  // Route elements passed as children render directly; nested routes use Outlet.
  const renderAllowed = () => children ?? <Outlet />;

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
        return renderAllowed();

      default:
        return <Navigate to="/local-match/setup" replace />;
    }
  }

  return renderAllowed();
};

export default ProtectedRoute;
