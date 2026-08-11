import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useGetTournamentInfoQuery } from "../../store/tournamentApi";
import { useState } from "react";
import { ChooseMatchActionModal } from "../../components/modals/ChooseMatchActionModal";
import { MatchList } from "../../components/MatchList";
export const MyTournamentMatches = () => {
  const [isMatchActionModal, setIsMatchActionModal] = useState(false);
  const { authUser } = useSelector((state) => state.auth);
  const { tournamentId } = useParams();

  const { data } = useGetTournamentInfoQuery(tournamentId);

  const organiserId = data?.myTournament?.createdBy?._id;
  const loggedInUserId = authUser?.player?._id;
  const varifiedOrganiser = organiserId === loggedInUserId;

  return (
    <div className="pt-24 h-dvh overflow-y-scroll p-2">
      {varifiedOrganiser && (
        <div className="flex justify-between items-center px-3 bg-base-300/40 mt-4 py-6 rounded-lg">
          <h1>Start a new match</h1>
          <button
            onClick={() => setIsMatchActionModal(true)}
            className="btn btn-success"
          >
            Start
          </button>
        </div>
      )}
      {isMatchActionModal && (
        <ChooseMatchActionModal setIsMatchActionModal={setIsMatchActionModal} />
      )}
      <MatchList tournamentId={tournamentId} />
    </div>
  );
};
