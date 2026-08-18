import React, { useState } from "react";
import { Header } from "../components/Header";
import { z } from "zod";
import { nanoid } from "nanoid";
import { AdvanceOptionModal } from "../components/AdvanceOptionModal";

export const MatchScoring = () => {
  const matchId = nanoid();

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
  //   console.log("advance data", advanceData);
  // Zod schema
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
          data.firstTeamName.toLowerCase() !== data.secondTeamName.toLowerCase()
        );
      },
      {
        message: "Both teams must have different names",
        path: ["secondTeamName"],
      },
    );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  //   console.log("advance data", advanceData);

  // Submit
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

    const matchData = {
      ...formData,
      ...advanceData,
      matchId,
    };

    setFormData(matchData);
    setErrors({});
    console.log(formData);

    // localStorage.setItem("matchData", JSON.stringify(matchData));
  };

  return (
    <div className="min-h-dvh bg-base-200 pt-20 px-4 pb-10 ">
      <Header data="Hills Cricket Scorer" />

      <main className="mx-auto w-full max-w-2xl ">
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
          className="rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm sm:p-7 "
        >
          {/* Teams */}
          <section>
            <div className="mb-4">
              <h2 className="font-semibold">Teams</h2>

              <p className="mt-1 text-xs text-base-content/50">
                Enter the names of both teams.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* First team */}
              <div>
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
                  className={`input w-full ${
                    errors.firstTeamName ? "input-error" : ""
                  }`}
                />

                {errors.firstTeamName && (
                  <p className="mt-1.5 text-xs text-error">
                    {errors.firstTeamName}
                  </p>
                )}
              </div>

              {/* Second team */}
              <div>
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
                  className={`input w-full ${
                    errors.secondTeamName ? "input-error" : ""
                  }`}
                />

                {errors.secondTeamName && (
                  <p className="mt-1.5 text-xs text-error">
                    {errors.secondTeamName}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="my-7 border-t border-base-content/10" />

          {/* Toss */}
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
                {/* First team */}
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

                {/* Second team */}
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
                <p className="mt-1.5 text-xs text-error">{errors.tossWinner}</p>
              )}
            </div>

            {/* Toss Decision */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium">Toss Winner Opt to</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Bat */}
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

                {/* Bowl */}
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
                className={`input w-full ${errors.overs ? "input-error" : ""}`}
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
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="btn btn-soft"
            >
              Advance Option
            </button>

            <button type="submit" className="btn btn-primary px-8">
              Start Match
            </button>
          </div>
        </form>
      </main>
      <div>
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
      </div>
    </div>
  );
};
