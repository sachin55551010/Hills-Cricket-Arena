import { useEffect, useState } from "react";
import { z } from "zod";
export const LocalTeamNameUpdateModal = ({ localTeams, teamId, onClose }) => {
  const [updatedTeamName, setUpdatedTeamName] = useState("");
  const [error, setError] = useState("");
  const teamNameSchema = z
    .string()
    .trim()
    .min(1, "Team name is required")
    .refine((value) => /[a-zA-Z]/.test(value), {
      message: "Team name must contain at least one letter",
    });
  const team = localTeams.find((team) => team.teamId === teamId);

  useEffect(() => {
    if (!teamId) return;

    setUpdatedTeamName(team.name);
  }, [localTeams, teamId, team]);

  const handleOnChange = (e) => {
    setUpdatedTeamName(e.target.value);
    setError("");
  };
  const handleUpdateNameBtn = () => {
    const result = teamNameSchema.safeParse(updatedTeamName);

    if (!result.success) {
      setError(result.error.issues[0].message);
      const errorMsg = result.error.issues[0].message;
      setError(errorMsg);

      return;
    }
    setError("");
    const updatedTeams = localTeams.map((team) =>
      team.teamId === teamId ? { ...team, name: updatedTeamName } : team,
    );

    localStorage.setItem("localTeams", JSON.stringify(updatedTeams));
    onClose();
  };

  return (
    <div className="inset-0 fixed flex items-center justify-center backdrop-blur-lg">
      <div className=" border border-base-content/15 rounded-md w-[80%] lg:w-[30%] flex flex-col p-4 gap-4">
        <h6>Update Team</h6>

        <div>
          <input
            value={updatedTeamName}
            onChange={handleOnChange}
            type="text"
            className={`border-b border-base-content/60 h-10 outline-0 pl-2 ${error ? "border-b border-red-500" : "border-b border-base-content/60"}`}
          />
          {error && <p className="text-[.8rem] mt-2 text-red-500">{error}</p>}
        </div>

        <div className="mt-8 flex gap-4 justify-end">
          <button onClick={onClose} className="btn btn-soft">
            Cancel
          </button>
          <button onClick={handleUpdateNameBtn} className="btn btn-info">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
