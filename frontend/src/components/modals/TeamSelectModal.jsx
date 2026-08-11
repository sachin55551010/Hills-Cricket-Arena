export const TeamSelectModal = ({
  handleTeamSelect,
  query,
  myTournamentTeams,
  loadingTeams,
}) => {
  const myteams = myTournamentTeams?.myTournamentTeams ?? [];

  const filterTeams = myteams.filter((team) =>
    team.teamName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className={`absolute h-40 z-100 top-[110%] w-100 bg-base-300 p-4 overflow-y-scroll ${
        filterTeams.length === 0 || query === "" ? "hidden" : ""
      }`}
    >
      {loadingTeams ? (
        <div>Loading...</div>
      ) : (
        <div>
          {myteams.length === 0 ? (
            <div>No team found</div>
          ) : (
            <ul>
              {filterTeams.map((team) => {
                return (
                  <li
                    onClick={() =>
                      handleTeamSelect({
                        teamName: team.teamName,
                        teamId: team._id,
                      })
                    }
                    key={team._id}
                  >
                    {team.teamName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
