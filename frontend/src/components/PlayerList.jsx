import { useSelector } from "react-redux";
import { useGetTournamentInfoQuery } from "../store/tournamentApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DummyListLoadingSkelton } from "./modals/DummyLoadingSkelton";
import noData from "../../assets/No data-amico.svg";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import bat from "../../assets/batsman.svg";
import ball from "../../assets/bowler.svg";
import { BadgeCheck, SquarePen, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { GenerateInviteLinkModal } from "./GenerateInviteLinkModal";
import { useCreateInviteLinkMutation } from "../store/inviteTeamLinkApi";
import { useGetTeamByIdQuery, useGetTeamPlayersQuery } from "../store/teamApi";
import { ChangeRoleModal } from "./modals/ChangeRoleModal";

export const PlayerList = ({ data, teamId }) => {
  const [addPlayerModal, setAddPlayerModal] = useState(false);
  const [changeRoleModal, setChangeRoleModal] = useState(false);
  const [selectPlayerId, setSelectPlayerId] = useState(null);
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);
  const { data: myTournamentInfo, isLoading } =
    useGetTournamentInfoQuery(tournamentId);

  const { data: myTeamData } = useGetTeamByIdQuery(teamId);
  const { data: teamPlayers } = useGetTeamPlayersQuery(teamId);
  const loggedInUserId = authUser?.player?._id;
  const tournamentOrganiserId = myTournamentInfo?.myTournament?.createdBy?._id;
  const teamAdminId = myTeamData?.team?.createdBy;

  const [
    createInviteLink,
    { data: inviteLinkUrl, isLoading: inviteLinkLoading },
  ] = useCreateInviteLinkMutation();

  // add player button function
  function invitePlayerBtn() {
    setAddPlayerModal(true);
    createInviteLink({ tournamentId, teamId }).unwrap();
  }

  /*
   * getting player list from data
   * if list is null or undefined it will return empty array
   */
  const playerList = teamPlayers?.myTeamPlayers?.teamPlayers ?? [];

  const totalPlayersInTeam = data?.countPlayers;

  // condition to check only team admin or organiser can add more players in team
  const canAddPlayers =
    loggedInUserId === tournamentOrganiserId || loggedInUserId === teamAdminId;

  const isTeamAdmin = loggedInUserId === teamAdminId;
  const handleEditBtn = () => {
    navigate(
      `/my-tournament/${tournamentId}/tournament-teams/update-team/${teamId}`,
    );
  };

  const roleStyle = {
    Captain: {
      className: "badge badge-soft badge-success",
      label: "C",
    },
    "Vice Captain": {
      className: "badge badge-soft badge-info",
      label: "VC",
    },
    "Wicket Keeper": {
      className: "badge badge-soft badge-warning",
      label: "WK",
    },
  };

  //handle button when click on player
  const handlePlayerClickBtn = (playerId) => {
    if (isTeamAdmin) {
      setSelectPlayerId(playerId);

      setChangeRoleModal(true);
    } else navigate(`/profile/${playerId}`);
  };
  // dummy data loading screen while data loading from db
  if (isLoading) {
    return <DummyListLoadingSkelton />;
  }

  return (
    <div className="h-dvh pt-24 px-2">
      {!authUser ? (
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[.8rem]">
            Please login to see more option
          </h1>
          <Link to="/login">
            <button className="btn btn-outline btn-info">Login</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 border border-base-content/10 py-4 px-2 rounded-lg">
            {canAddPlayers ? (
              <div className="flex items-center justify-between ml-3">
                <div>
                  <h1 className="font-semibold">Add more players ?</h1>
                  <p className="text-[.75rem] text-base-content/60 mt-4">
                    Add more players in your team via invite link
                  </p>
                </div>
                {canAddPlayers && (
                  <button onClick={invitePlayerBtn} className="btn btn-info">
                    Invite
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="font-semibold text-[.75rem]">
                  Please Ask Organiser or Team admin to add more players
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="badge badge-soft badge-success flex gap-2 my-4 items-center py-5 px-4">
              <Users size={20} />
              <h1 className="font-semibold text-base-content/60">Players</h1>
              <span className="font-bold">{totalPlayersInTeam}</span>
            </div>

            {canAddPlayers && (
              <button
                onClick={handleEditBtn}
                className="btn btn-soft btn-success flex gap-2"
              >
                <SquarePen size={18} />
                <h1 className="text-[.8rem] font-semibold">Edit</h1>
              </button>
            )}
          </div>
        </>
      )}

      {/* player list */}
      <div>
        {playerList.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <img src={noData} alt="" className="h-50 w-auto" />
            <h1 className="italic">No players found!</h1>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {playerList.map((teamPlayer) => {
              return (
                <li
                  onClick={() => handlePlayerClickBtn(teamPlayer.player._id)}
                  key={teamPlayer.player._id}
                  className="group flex items-center gap-3 p-2 rounded-xl border border-base-content/10 bg-base-100/50 backdrop-blur-sm hover:bg-base-content/5 hover:border-base-content/20 transition-all duration-200 cursor-pointer"
                >
                  {/* Player Profile Image */}
                  <div className="h-9 w-9 shrink-0">
                    {teamPlayer?.player?.profilePicture === "" ? (
                      <div className="bg-accent h-full w-full rounded-full flex items-center justify-center font-medium text-sm text-accent-content">
                        {defaultAvatar(teamPlayer?.player?.playerName)}
                      </div>
                    ) : (
                      <img
                        src={teamPlayer?.player?.profilePicture}
                        alt={teamPlayer?.player?.playerName}
                        className="h-full w-full object-cover rounded-full ring-1 ring-base-content/10"
                      />
                    )}
                  </div>

                  {/* Player Details */}
                  <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                    {/* Name + Role Badges */}
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-sm capitalize text-base-content truncate">
                        {teamPlayer?.player?.playerName}
                      </h3>

                      <div className="flex gap-1 shrink-0">
                        {teamPlayer?.role?.map((role) => {
                          const style = roleStyle[role];
                          if (!style) return null;

                          return (
                            <span
                              key={role}
                              className={`${style.className} text-[0.6rem] px-1.5 py-0.5 rounded font-medium leading-none`}
                            >
                              {style.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Compact stats row */}
                    <div className="flex justify-between gap-2.5 text-[0.68rem] text-base-content/60">
                      <span className="flex items-center gap-1">
                        <img
                          src={bat}
                          alt="Batting"
                          className="h-2.5 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="capitalize">
                          {teamPlayer?.player?.battingStyle || "-"}
                        </span>
                      </span>

                      <span className="flex items-center gap-1">
                        <img
                          src={ball}
                          alt="Bowling"
                          className="h-2.5 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="capitalize">
                          {teamPlayer?.player?.bowlingStyle || "-"}
                        </span>
                      </span>

                      <span className="flex items-center gap-1">
                        <UserRound
                          size={10}
                          className="opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="capitalize">
                          {teamPlayer?.player?.playingRole || "-"}
                        </span>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {addPlayerModal && (
        <GenerateInviteLinkModal
          setAddPlayerModal={setAddPlayerModal}
          inviteLinkLoading={inviteLinkLoading}
          inviteLinkUrl={inviteLinkUrl}
          data={data}
        />
      )}
      {changeRoleModal && (
        <ChangeRoleModal
          setChangeRoleModal={setChangeRoleModal}
          teamId={teamId}
          selectPlayerId={selectPlayerId}
          tournamentId={tournamentId}
          teamPlayers={teamPlayers}
        />
      )}
    </div>
  );
};
