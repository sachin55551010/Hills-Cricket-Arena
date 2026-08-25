import { useParams } from "react-router-dom";

export const AddLocalTeamPlayer = () => {
  const { teamId } = useParams();
  console.log(teamId);

  return <div className="h-dvh w-screen">AddLocalTeamPlayer</div>;
};
