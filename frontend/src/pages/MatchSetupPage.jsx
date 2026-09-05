import { useState } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { AdvanceOptionModal } from "../components/AdvanceOptionModal";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCurrentMatchData } from "../store/scoreSlice";

export const MatchSetupPage = () => {
  const matchId = nanoid();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localTeams = JSON.parse(localStorage.getItem("localTeams")) || [];

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstTeamName: "",
    secondTeamName: "",
    tossWinner: "",
    tossDecision: "",
    overs: "",
    status: "setup",
  });

  const [errors, setErrors] = useState({});

  const [advanceData, setAdvanceData] = useState({
    firstTeamPlayers: 11,
    secondTeamPlayers: 11,
    noBallRuns: 1,
    wideBallRuns: 1,
  });

  // TEAM SUGGESTIONS

  const firstTeamNameList = localTeams.filter((team) => {
    const searchValue = formData.firstTeamName.trim();

    if (!searchValue) return false;

    return team.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const secondTeamNameList = localTeams.filter((team) => {
    const searchValue = formData.secondTeamName.trim();

    if (!searchValue) return false;

    return team.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  // CHECK IF TEAM IS ALREADY SELECTED

  const isTeamSelected = (team) => {
    const teamName = team.name.trim().toLowerCase();

    return (
      formData.firstTeamName.trim().toLowerCase() === teamName ||
      formData.secondTeamName.trim().toLowerCase() === teamName
    );
  };

  // SELECT TEAM FROM SUGGESTION

  const handleSelectTeam = (fieldName, team) => {
    // Don't allow the same team to be selected twice
    if (isTeamSelected(team)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: team.name,

      // Reset toss winner if changing a team
      tossWinner:
        fieldName === "firstTeamName" && prev.tossWinner === prev.firstTeamName
          ? ""
          : fieldName === "secondTeamName" &&
              prev.tossWinner === prev.secondTeamName
            ? ""
            : prev.tossWinner,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
      tossWinner: "",
    }));
  };

  // GET EXISTING TEAM OR CREATE NEW TEAM

  const getOrCreateTeam = (teamName, teams) => {
    const normalizedName = teamName.trim().toLowerCase();

    const existingTeam = teams.find(
      (team) => team.name.trim().toLowerCase() === normalizedName,
    );

    if (existingTeam) {
      return existingTeam;
    }

    return {
      teamId: nanoid(),
      name: teamName.trim(),
      players: [],
    };
  };

  // ZOD SCHEMA

  const matchSchema = z
    .object({
      firstTeamName: z
        .string()
        .trim()
        .min(1, "First team name is required")
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: "Team name must contain at least one letter",
        }),

      secondTeamName: z
        .string()
        .trim()
        .min(1, "Second team name is required")
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: "Team name must contain at least one letter",
        }),

      tossWinner: z.string().trim().min(1, "Please select the toss winner"),

      tossDecision: z.enum(["bat", "bowl"], {
        error: "Please select bat or bowl",
      }),

      overs: z.coerce
        .number({
          error: "Overs are required",
        })
        .int("Overs must be a whole number")
        .min(1, "Minimum 1 over is required")
        .max(50, "Maximum 50 overs are allowed"),
    })
    .refine(
      (data) => {
        return (
          data.firstTeamName.trim().toLowerCase() !==
          data.secondTeamName.trim().toLowerCase()
        );
      },
      {
        message: "Both teams must have different names",
        path: ["secondTeamName"],
      },
    );

  // FORM STATUS

  const checkStatus = matchSchema.safeParse(formData);
  const isFormField = checkStatus.success;

  // HANDLE INPUT CHANGES

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    // If team name is being manually changed,
    // reset toss winner because old selection may no longer exist.
    if (
      name === "firstTeamName" &&
      formData.tossWinner === formData.firstTeamName
    ) {
      updatedFormData.tossWinner = "";
    }

    if (
      name === "secondTeamName" &&
      formData.tossWinner === formData.secondTeamName
    ) {
      updatedFormData.tossWinner = "";
    }

    setFormData(updatedFormData);

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Check duplicate team names
    if (
      updatedFormData.firstTeamName.trim() &&
      updatedFormData.secondTeamName.trim() &&
      updatedFormData.firstTeamName.trim().toLowerCase() ===
        updatedFormData.secondTeamName.trim().toLowerCase()
    ) {
      setErrors((prev) => ({
        ...prev,
        secondTeamName: "Both teams must have different names",
      }));
    }
  };

  // SUBMIT

  const handleSubmitBtn = (e) => {
    e.preventDefault();

    const result = matchSchema.safeParse(formData);

    const errorFields = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const errorName = issue.path[0];

        if (!errorFields[errorName]) {
          errorFields[errorName] = issue.message;
        }
      });

      setErrors(errorFields);
      return;
    }

    // GET TEAMS

    const currentLocalTeams = JSON.parse(
      localStorage.getItem("localTeams") || "[]",
    );

    const firstTeam = getOrCreateTeam(
      formData.firstTeamName,
      currentLocalTeams,
    );

    const secondTeam = getOrCreateTeam(
      formData.secondTeamName,
      currentLocalTeams,
    );

    // MATCH DATA

    const matchData = {
      matchId,

      firstTeam: {
        ...firstTeam,
        players: [...(firstTeam.players || [])],
      },

      secondTeam: {
        ...secondTeam,
        players: [...(secondTeam.players || [])],
      },

      currentInning: 1,

      toss: {
        winner:
          formData.tossWinner.trim().toLowerCase() ===
          firstTeam.name.trim().toLowerCase()
            ? {
                name: firstTeam.name,
                teamId: firstTeam.teamId,
              }
            : {
                name: secondTeam.name,
                teamId: secondTeam.teamId,
              },

        decision: formData.tossDecision,
      },

      status: "players",

      overs: Number(formData.overs),

      firstTeamTotalPlayer: Number(advanceData.firstTeamPlayers),

      secondTeamTotalPlayer: Number(advanceData.secondTeamPlayers),

      noBallRun: Number(advanceData.noBallRuns),

      wideBallRun: Number(advanceData.wideBallRuns),

      createdAt: new Date().toISOString(),
    };

    // UPDATE LOCAL TEAMS WITHOUT DUPLICATES

    const updatedTeams = [...currentLocalTeams];

    const firstTeamIndex = updatedTeams.findIndex(
      (team) => team.teamId === firstTeam.teamId,
    );

    if (firstTeamIndex === -1) {
      updatedTeams.push(firstTeam);
    } else {
      // Keep the existing team and its players
      updatedTeams[firstTeamIndex] = {
        ...updatedTeams[firstTeamIndex],
        ...firstTeam,
        players: [...(updatedTeams[firstTeamIndex].players || [])],
      };
    }

    const secondTeamIndex = updatedTeams.findIndex(
      (team) => team.teamId === secondTeam.teamId,
    );

    if (secondTeamIndex === -1) {
      updatedTeams.push(secondTeam);
    } else {
      // Keep the existing team and its players
      updatedTeams[secondTeamIndex] = {
        ...updatedTeams[secondTeamIndex],
        ...secondTeam,
        players: [...(updatedTeams[secondTeamIndex].players || [])],
      };
    }

    localStorage.setItem("localTeams", JSON.stringify(updatedTeams));

    // SAVE CURRENT MATCH

    localStorage.setItem("currentMatch", JSON.stringify(matchData));
    dispatch(setCurrentMatchData(matchData));
    setErrors({});

    navigate("/local-match/players");
  };

  // BACK

  const handleBackBtn = () => {
    navigate("/");
  };

  // ADD PLAYERS

  const handleAddPlayers = () => {
    navigate("/local-match/teams");
  };

  // TEAM SUGGESTION COMPONENT

  const renderTeamSuggestion = (team, fieldName) => {
    const selected = isTeamSelected(team);

    return (
      <li
        key={team.teamId}
        onClick={() => !selected && handleSelectTeam(fieldName, team)}
        className={`rounded-lg px-3 py-2 transition ${
          selected
            ? "cursor-not-allowed opacity-40"
            : "cursor-pointer hover:bg-base-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span>{team.name}</span>

          {selected && <span className="text-xs opacity-60">Selected</span>}
        </div>
      </li>
    );
  };

  // UI

  return (
    <div className="min-h-dvh bg-base-200 pt-20 pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 z-[999] flex h-[var(--nav-h)] w-dvw items-center gap-2 bg-base-100 px-2">
        <div className="flex items-center gap-2">
          <ArrowLeft
            size={30}
            strokeWidth={3}
            onClick={handleBackBtn}
            className="cursor-pointer"
          />

          <h4 className="font-bold">Hills Cricket Scorer</h4>
        </div>
      </header>

      <main className="mx-auto mb-10 w-full max-w-2xl px-4">
        {/* Page heading */}
        <div className="mb-6">
          <p className="text-sm font-medium text-base-content/50">
            FRIENDLY MATCH
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Match Setup
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Enter the match details to start scoring.
          </p>
        </div>

        <form
          onSubmit={handleSubmitBtn}
          className="rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm sm:p-7"
        >
          {/* Teams */}
          <section>
            <div className="mb-4">
              <h2 className="font-semibold">Teams</h2>

              <p className="mt-1 text-xs text-base-content/50">
                Enter the names of both teams.
              </p>
            </div>

            {/* Add players information card */}
            <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users size={20} />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold">
                    Add players before the match
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-base-content/60">
                    Have your teams ready before you start scoring. Add players
                    to your teams now so you won't have to enter them manually
                    during the match.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddPlayers}
                    className="btn btn-primary btn-sm mt-3"
                  >
                    Manage Teams & Players
                  </button>
                </div>
              </div>
            </div>

            {/* Team inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* FIRST TEAM */}
              <div className="relative">
                <label
                  htmlFor="firstTeamName"
                  className="mb-1.5 block text-sm font-medium"
                >
                  First Team
                </label>

                <input
                  type="text"
                  id="firstTeamName"
                  name="firstTeamName"
                  value={formData.firstTeamName}
                  onChange={handleChange}
                  placeholder="e.g. Hills XI"
                  autoComplete="off"
                  className={`input w-full ${
                    errors.firstTeamName ? "input-error" : ""
                  } outline-0`}
                />

                {errors.firstTeamName && (
                  <p className="mt-1.5 text-xs text-error">
                    {errors.firstTeamName}
                  </p>
                )}

                {/* FIRST TEAM SUGGESTIONS */}
                {formData.firstTeamName.trim() && (
                  <ul className="mt-1 rounded-lg border border-base-content/15 bg-base-100 p-2 shadow-sm">
                    {firstTeamNameList.length > 0 ? (
                      firstTeamNameList.map((team) =>
                        renderTeamSuggestion(team, "firstTeamName"),
                      )
                    ) : (
                      <li className="px-3 py-2 text-sm opacity-60">
                        No team found. This name will be created as a new team.
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* SECOND TEAM */}
              <div className="relative">
                <label
                  htmlFor="secondTeamName"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Second Team
                </label>

                <input
                  type="text"
                  id="secondTeamName"
                  name="secondTeamName"
                  value={formData.secondTeamName}
                  onChange={handleChange}
                  placeholder="e.g. Shimla Warriors"
                  autoComplete="off"
                  className={`input w-full ${
                    errors.secondTeamName ? "input-error" : ""
                  } outline-0`}
                />

                {errors.secondTeamName && (
                  <p className="mt-1.5 text-xs text-error">
                    {errors.secondTeamName}
                  </p>
                )}

                {/* SECOND TEAM SUGGESTIONS */}
                {formData.secondTeamName.trim() && (
                  <ul className="mt-1 rounded-lg border border-base-content/15 bg-base-100 p-2 shadow-sm">
                    {secondTeamNameList.length > 0 ? (
                      secondTeamNameList.map((team) =>
                        renderTeamSuggestion(team, "secondTeamName"),
                      )
                    ) : (
                      <li className="px-3 py-2 text-sm opacity-60">
                        No team found. This name will be created as a new team.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <div className="my-7 border-t border-base-content/10" />

          {/* Toss */}
          <fieldset className="disabled:opacity-50">
            <section>
              <div className="mb-4">
                <h2 className="font-semibold">Toss</h2>

                <p className="mt-1 text-xs text-base-content/50">
                  Select the team that won the toss and their decision.
                </p>
              </div>

              {/* Toss Winner */}
              <div>
                <p className="mb-2 text-sm font-medium">Toss won by</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* FIRST TEAM */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                      formData.tossWinner === formData.firstTeamName &&
                      formData.firstTeamName !== ""
                        ? "border-primary bg-primary/5"
                        : "border-base-content/10 hover:border-base-content/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tossWinner"
                      value={formData.firstTeamName}
                      checked={
                        formData.firstTeamName !== "" &&
                        formData.tossWinner === formData.firstTeamName
                      }
                      onChange={handleChange}
                      className="radio radio-primary"
                    />

                    <span className="text-sm font-medium">
                      {formData.firstTeamName || "First Team"}
                    </span>
                  </label>

                  {/* SECOND TEAM */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                      formData.tossWinner === formData.secondTeamName &&
                      formData.secondTeamName !== ""
                        ? "border-primary bg-primary/5"
                        : "border-base-content/10 hover:border-base-content/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tossWinner"
                      value={formData.secondTeamName}
                      checked={
                        formData.secondTeamName !== "" &&
                        formData.tossWinner === formData.secondTeamName
                      }
                      onChange={handleChange}
                      className="radio radio-primary"
                    />

                    <span className="text-sm font-medium">
                      {formData.secondTeamName || "Second Team"}
                    </span>
                  </label>
                </div>

                {errors.tossWinner && (
                  <p className="mt-1.5 text-xs text-error">
                    {errors.tossWinner}
                  </p>
                )}
              </div>

              {/* Toss Decision */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium">Toss Winner Opt to</p>

                <div className="grid grid-cols-2 gap-3">
                  {/* BAT */}
                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 transition-colors ${
                      formData.tossDecision === "bat"
                        ? "border-primary bg-primary/5"
                        : "border-base-content/10 hover:border-base-content/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tossDecision"
                      value="bat"
                      checked={formData.tossDecision === "bat"}
                      onChange={handleChange}
                      className="radio radio-primary"
                    />

                    <span className="text-sm font-medium">Bat</span>
                  </label>

                  {/* BOWL */}
                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 transition-colors ${
                      formData.tossDecision === "bowl"
                        ? "border-primary bg-primary/5"
                        : "border-base-content/10 hover:border-base-content/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tossDecision"
                      value="bowl"
                      checked={formData.tossDecision === "bowl"}
                      onChange={handleChange}
                      className="radio radio-primary"
                    />

                    <span className="text-sm font-medium">Bowl</span>
                  </label>
                </div>

                {errors.tossDecision && (
                  <p className="mt-1.5 text-xs text-error">
                    {errors.tossDecision}
                  </p>
                )}
              </div>
            </section>
          </fieldset>

          <div className="my-7 border-t border-base-content/10" />

          {/* Match Format */}
          <section>
            <div className="mb-4">
              <h2 className="font-semibold">Match Format</h2>

              <p className="mt-1 text-xs text-base-content/50">
                Set the number of overs for the match.
              </p>
            </div>

            <div className="max-w-xs">
              <label
                htmlFor="overs"
                className="mb-1.5 block text-sm font-medium"
              >
                Number of Overs
              </label>

              <input
                type="number"
                id="overs"
                name="overs"
                value={formData.overs}
                onChange={handleChange}
                min="1"
                max="50"
                placeholder="e.g. 10"
                className={`input w-full ${
                  errors.overs ? "input-error" : ""
                } outline-0`}
              />

              <p className="mt-1.5 text-xs text-base-content/45">
                Maximum 50 overs
              </p>

              {errors.overs && (
                <p className="mt-1.5 text-xs text-error">{errors.overs}</p>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="btn btn-soft"
            >
              Advance Option
            </button>

            <button
              disabled={!isFormField}
              type="submit"
              className="btn btn-primary cursor-pointer px-8 disabled:cursor-not-allowed"
            >
              Start Match
            </button>
          </div>
        </form>
      </main>

      {/* Advance Options Modal */}
      {isOpen && (
        <AdvanceOptionModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          firstTeamName={formData.firstTeamName}
          secondTeamName={formData.secondTeamName}
          advanceData={advanceData}
          setAdvanceData={setAdvanceData}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-2 flex w-full items-center justify-center">
        <footer className="flex w-[70%] items-center justify-between gap-2 rounded-full border border-base-content/15 px-4 py-4 text-[.8rem] font-semibold backdrop-blur-md lg:w-[40%]">
          <Link className="cursor-pointer" to="/local-match/setup">
            New Match
          </Link>

          <Link className="cursor-pointer" to="/local-match/teams">
            Team
          </Link>

          <Link
            className="cursor-pointer"
            to="/local-match/local-match-history"
          >
            History
          </Link>
        </footer>
      </div>
    </div>
  );
};
