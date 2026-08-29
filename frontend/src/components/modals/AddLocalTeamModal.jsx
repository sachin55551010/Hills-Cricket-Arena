import { useState } from "react";
import { nanoid } from "nanoid";
import { z } from "zod";
import { X } from "lucide-react";

const teamNameSchema = z
  .string()
  .min(1, "Team name is required")
  .refine((value) => value === value.trim(), {
    message: "Team name cannot start or end with spaces",
  })
  .refine((value) => /[a-zA-Z]/.test(value), {
    message: "Team name must contain at least one letter",
  })
  .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value), {
    message: "Only letters, numbers and spaces are allowed",
  });

export const AddLocalTeamModal = ({ localTeams, onClose }) => {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (e) => {
    const value = e.target.value;

    setTeamName(value);

    if (error) {
      setError("");
    }
  };

  const handleAddTeamBtn = (e) => {
    e.preventDefault();

    // Zod validation
    const result = teamNameSchema.safeParse(teamName);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const cleanedTeamName = result.data.trim();

    // Duplicate team name check
    const teamAlreadyExists = localTeams.some(
      (team) => team.name.toLowerCase() === cleanedTeamName.toLowerCase(),
    );

    if (teamAlreadyExists) {
      setError("A team with this name already exists");
      return;
    }

    const team = {
      teamId: nanoid(),
      name: cleanedTeamName,
      players: [],
    };

    const updatedTeam = [...localTeams, team];

    localStorage.setItem("localTeams", JSON.stringify(updatedTeam));

    // Reset form
    setTeamName("");
    setError("");

    // Close modal after successful creation
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex h-dvh w-screen items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleAddTeamBtn}
        className="relative w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="text-xl font-semibold tracking-tight">
            Create a team
          </h2>

          <p className="mt-1 text-sm leading-5 text-base-content/60">
            Add a team now and manage its players before starting a match.
          </p>
        </div>

        {/* Input */}
        <div>
          <label htmlFor="teamName" className="mb-2 block text-sm font-medium">
            Team name
          </label>

          <input
            id="teamName"
            name="teamName"
            type="text"
            value={teamName}
            onChange={handleOnChange}
            placeholder="e.g. Chennai Strikers"
            autoFocus
            className={`h-11 w-full rounded-xl border bg-base-100 px-3 text-sm outline-none transition placeholder:text-base-content/30 focus:ring-2 ${
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-base-content/15 focus:border-info focus:ring-info/20"
            }`}
          />

          {/* Error */}
          {error && (
            <p className="mt-2 text-xs font-medium text-error">{error}</p>
          )}
        </div>

        <div className="flex justify-end">
          {/* Create Button */}
          <button
            type="submit"
            disabled={!teamName.trim()}
            className="mt-6 py-3 p-3 rounded-md bg-info font-medium text-info-content transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create team
          </button>
        </div>
      </form>
    </div>
  );
};
