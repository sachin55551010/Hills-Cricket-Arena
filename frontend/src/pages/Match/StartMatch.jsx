import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetTournamentInfoQuery } from "../../store/tournamentApi";
import accessDenied from "../../../assets/unautherised.svg";
import { useState } from "react";
import { useGetTeamsByTournamentQuery } from "../../store/teamApi";
import { TeamSelectModal } from "../../components/modals/TeamSelectModal";
import { ROUND } from "../../constant/matchRound";
import { toast } from "react-toastify";
import {
  useScheduleMatchMutation,
  useStartMatchMutation,
} from "../../store/matchApi";
import { CircleAlert } from "lucide-react";
export const StartMatch = ({ mode }) => {
  const [firstTeam, setFirstTeam] = useState("");
  const [secondTeam, setSecondTeam] = useState("");
  const [optedTo, setOptedTo] = useState(null);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [matchData, setMatchData] = useState({
    firstTeamId: "",
    secondTeamId: "",
    overs: "",
    tossWinnerTeamId: "",
    round: "",
    decision: "",
    matchScheduleDate: "",
  });

  const navigate = useNavigate();
  const handleTossWinnerBtn = (teamId) => {
    setMatchData((prev) => ({ ...prev, tossWinnerTeamId: teamId }));
  };

  const handleOptedToBtn = (decision) => {
    setOptedTo(decision);
    setMatchData((prev) => ({ ...prev, decision }));
  };

  const { authUser } = useSelector((state) => state.auth);
  const { tournamentId } = useParams();

  const { data } = useGetTournamentInfoQuery(tournamentId);
  const { data: myTournamentTeams, isLoading: loadingTeams } =
    useGetTeamsByTournamentQuery(tournamentId);

  const organiserId = data?.myTournament?.createdBy?._id;
  const loggedInUserId = authUser?.player?._id;
  const varifiedOrganiser = organiserId === loggedInUserId;

  const [startMatch, { isLoading: isStartMatchLoading }] =
    useStartMatchMutation();
  const [scheduleMatch, { isLoading: isScheduleMatchLoading }] =
    useScheduleMatchMutation();

  const handleTeamSelect = ({ teamName, teamId }) => {
    if (isFirstModalOpen) {
      setFirstTeam(teamName);
      setIsFirstModalOpen(false);
      setMatchData((prev) => ({ ...prev, firstTeamId: teamId }));
    }
    if (isSecondModalOpen) {
      setSecondTeam(teamName);
      setIsSecondModalOpen(false);
      setMatchData((prev) => ({ ...prev, secondTeamId: teamId }));
    }
  };

  const checkValidation = () => {
    if (
      !firstTeam?.trim() ||
      !secondTeam?.trim() ||
      !matchData.firstTeamId ||
      !matchData.secondTeamId ||
      !matchData.overs ||
      !matchData.round ||
      !matchData.tossWinnerTeamId ||
      !matchData.decision
    ) {
      toast.error("All fields are required", {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    if (matchData.firstTeamId === matchData.secondTeamId) {
      toast.error("Both teams cannot be same");
      return false;
    } else {
      return true;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "start") {
        if (!checkValidation()) return;
        await startMatch({ data: matchData, tournamentId }).unwrap();
        toast.success("Match created successfully", {
          theme: "colored",
          autoClose: 1500,
        });
      }
      if (mode === "schedule") {
        const matchFields = Object.fromEntries(
          Object.entries(matchData).filter(([, val]) => val !== ""),
        );

        await scheduleMatch({ data: matchFields, tournamentId }).unwrap();
        toast.success("Match Schedule successfully", {
          theme: "colored",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message, {
        autoClose: 1500,
        theme: "colored",
      });
    } finally {
      navigate(`/my-tournament/${tournamentId}/tournament-matches`);
    }
  };

  return (
    <div className="h-dvh pt-22 overflow-y-auto">
      {!varifiedOrganiser ? (
        <div className="h-[100%] flex justify-center pt-10">
          <div className="w-fit flex flex-col items-center">
            <img src={accessDenied} alt="" className="h-90" />
            <p className="w-[80%] font-bold">
              You don't have permission to start a match. Only the tournament
              organiser can initiate a new match.
            </p>
          </div>
        </div>
      ) : (
        <div className=" min-h-[100%] flex justify-center py-4">
          <form
            onSubmit={handleFormSubmit}
            className="border border-base-content/20 rounded-lg w-[95%] md:w-[60%] flex flex-col items-center p-4 gap-2"
          >
            <header className="flex flex-col gap-3">
              <h1 className="text-xl font-bold p-2 text-center">
                Configure Match Details
              </h1>

              <div className="flex gap-2 px-2 bg-red-400/20 items-center rounded-lg py-2 ">
                <div>
                  <CircleAlert size={22} className="text-red-500" />
                </div>
                <p className="text-[.75rem]">
                  If teams have not been added to the tournament, please add
                  team first before start or schedule a match.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 w-full gap-6 md:grid-cols-2 mt-3">
              {/* FIRST TEAM */}
              <label className="flex flex-col gap-2 relative">
                <h1 className="font-bold">First Team*</h1>
                <input
                  value={firstTeam}
                  onChange={(e) => {
                    setFirstTeam(e.target.value);
                    setIsFirstModalOpen(true);
                  }}
                  required
                  type="text"
                  className="border border-base-content/40 h-10 rounded-lg pl-3 outline-0"
                  placeholder="Choose first team"
                />
                {isFirstModalOpen && (
                  <TeamSelectModal
                    query={firstTeam}
                    handleTeamSelect={handleTeamSelect}
                    myTournamentTeams={myTournamentTeams}
                    loadingTeams={loadingTeams}
                  />
                )}
              </label>

              {/* SECOND TEAM */}
              <label className="flex flex-col gap-2 relative">
                <h1 className="font-bold">Second Team*</h1>
                <input
                  value={secondTeam}
                  onChange={(e) => {
                    setSecondTeam(e.target.value);
                    setIsSecondModalOpen(true);
                  }}
                  required
                  type="text"
                  className="border border-base-content/40 h-10 rounded-lg pl-3 outline-0"
                  placeholder="Choose second team"
                />
                {isSecondModalOpen && (
                  <TeamSelectModal
                    query={secondTeam}
                    handleTeamSelect={handleTeamSelect}
                    myTournamentTeams={myTournamentTeams}
                    loadingTeams={loadingTeams}
                  />
                )}
              </label>
            </div>

            {/* Create Team */}
            <div className="flex justify-between w-full mt-4 items-center p-3 rounded-md shadow-[0px_0px_2px_rgba(0,0,0,.4)]">
              <p className="font-bold text-sm">Team not found in tournament?</p>
              <Link
                to={`/my-tournament/${tournamentId}/tournament-teams/create-team`}
                className="btn btn-info"
              >
                <button type="button">Add Team</button>
              </Link>
            </div>
            {/* choose overs */}
            <div className="w-full mt-4 flex flex-col justify-start gap-2">
              <h1>Choose Overs*</h1>
              <input
                value={matchData.overs}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? null : Number(e.target.value);
                  if (value <= 50) {
                    setMatchData({ ...matchData, overs: value });
                  }
                }}
                required
                type="number"
                className="border border-base-content/40 h-10 rounded-lg pl-3 outline-0 md:w-[40%]"
                max={50}
                placeholder="Max over limit 50"
              />
            </div>
            {/* choose round */}
            <div className="w-full mt-6">
              <label htmlFor="round" className="flex flex-col gap-2 md:w-[40%]">
                <h1>Choose Round*</h1>
                <select
                  value={matchData.round}
                  onChange={(e) =>
                    setMatchData({ ...matchData, round: e.target.value })
                  }
                  name=""
                  id=""
                  className="h-10 border border-base-content/30 rounded-lg"
                >
                  <option value="" disabled>
                    Choose Round
                  </option>

                  {ROUND.map((round) => {
                    return (
                      <option key={round} value={round} className="bg-base-300">
                        {round}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            {/* schedule match date */}
            <div className="w-full mt-4">
              <label htmlFor="" className="flex flex-col gap-2">
                <h1>Choose Date*</h1>
                <input
                  value={matchData.matchScheduleDate}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      matchScheduleDate: e.target.value,
                    })
                  }
                  required
                  type="date"
                  className="border border-base-content/40 h-10 rounded-lg px-2"
                />
              </label>
            </div>
            {mode === "start" && (
              <div className="w-full">
                {/* toss result */}
                <div className="w-full mt-2">
                  <h1 className="font-bold">Toss Won By*</h1>
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleTossWinnerBtn(matchData.firstTeamId)}
                      className={`bg-base-200 py-3 px-4 rounded-md cursor-pointer ${
                        matchData.firstTeamId === matchData.tossWinnerTeamId
                          ? "bg-warning"
                          : "bg-base-200 "
                      } disabled:bg-base-200/30 disabled:cursor-not-allowed disabled:text-base-content/30`}
                      disabled={
                        !matchData.firstTeamId || !matchData.secondTeamId
                      }
                    >
                      {firstTeam || "First team"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleTossWinnerBtn(matchData.secondTeamId)
                      }
                      className={`bg-base-200 py-3 px-4 rounded-md cursor-pointer ${
                        matchData.secondTeamId === matchData.tossWinnerTeamId
                          ? "bg-success"
                          : "bg-base-200"
                      } disabled:bg-base-200/30 disabled:cursor-not-allowed disabled:text-base-content/30`}
                      disabled={
                        !matchData.firstTeamId || !matchData.secondTeamId
                      }
                    >
                      {secondTeam || "Second Team"}
                    </button>
                  </div>
                </div>

                {/* opted option */}
                <div className="w-full mt-2">
                  <h1 className="font-bold">Opted To*</h1>
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleOptedToBtn("Bat")}
                      className={`${
                        optedTo === "Bat" ? "bg-red-400" : "bg-base-200"
                      } bg-base-200 py-3 px-8 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-base-200/30 disabled:text-base-content/30`}
                      disabled={
                        !matchData.firstTeamId || !matchData.secondTeamId
                      }
                    >
                      Bat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOptedToBtn("Bowl")}
                      className={`${
                        optedTo === "Bowl" ? "bg-red-400" : "bg-base-200"
                      } bg-base-200 py-3 px-8 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:bg-base-200/30 disabled:text-base-content/30`}
                      disabled={
                        !matchData.firstTeamId || !matchData.secondTeamId
                      }
                    >
                      Bowl
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn btn-info w-full"
              disabled={isScheduleMatchLoading || isStartMatchLoading}
            >
              {mode === "start" ? (
                isStartMatchLoading ? (
                  <div>
                    <span>Starting</span>
                    <span className="loading loading-spinner loading-sm"></span>
                  </div>
                ) : (
                  "Start"
                )
              ) : isScheduleMatchLoading ? (
                <div>
                  <span>Scheduling</span>
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : (
                "Schedule"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
