import { useState } from "react";
import { X } from "lucide-react";
import { z } from "zod";
export const AdvanceOptionModal = ({
  isOpen,
  onClose,
  firstTeamName,
  secondTeamName,
  advanceData,
  setAdvanceData,
}) => {
  const [errors, setAdvanceErrors] = useState({});
  if (!isOpen) return null;

  const advanceSchema = z.object({
    firstTeamPlayers: z.coerce
      .number({
        error: "Players are required",
      })
      .int("Players must be a whole number")
      .min(2, "Minimum 2 players")
      .max(11, "Maximum 11 players"),

    secondTeamPlayers: z.coerce
      .number({
        error: "Players are required",
      })
      .int("Players must be a whole number")
      .min(2, "Minimum 2 players")
      .max(11, "Maximum 11 players"),

    noBallRuns: z.coerce
      .number({
        error: "No-ball runs are required",
      })
      .int("Runs must be a whole number")
      .min(0, "Runs cannot be negative"),

    wideBallRuns: z.coerce
      .number({
        error: "Wide-ball runs are required",
      })
      .int("Runs must be a whole number")
      .min(0, "Runs cannot be negative"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdvanceData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setAdvanceErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSaveOption = () => {
    const result = advanceSchema.safeParse(advanceData);
    const errorFields = {};
    if (!result.success) {
      result.error.issues.map((issue) => {
        const errorName = issue.path[0];
        if (!errorFields[errorName]) {
          errorFields[errorName] = issue.message;
        }
      });
      setAdvanceErrors(errorFields);
      return;
    } else {
      setAdvanceErrors({});
      setAdvanceData(advanceData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-base-content/10 bg-base-100 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-content/10 px-5 py-4">
          <div>
            <h2 className="font-semibold">Advanced Options</h2>

            <p className="mt-0.5 text-xs text-base-content/50">
              Configure players and scoring rules.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-5">
          {/* Players per team */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">Players Per Team</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* First team */}
              <div>
                <label
                  htmlFor="firstTeamPlayers"
                  className="mb-1.5 block text-xs font-medium"
                >
                  {firstTeamName || "First Team"}
                </label>

                <input
                  id="firstTeamPlayers"
                  name="firstTeamPlayers"
                  type="number"
                  min="2"
                  max="11"
                  value={advanceData.firstTeamPlayers}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.firstTeamPlayers ? "input-error" : ""
                  }`}
                />

                {errors.firstTeamPlayers && (
                  <p className="mt-1 text-xs text-error">
                    {errors.firstTeamPlayers}
                  </p>
                )}
              </div>

              {/* Second team */}
              <div>
                <label
                  htmlFor="secondTeamPlayers"
                  className="mb-1.5 block text-xs font-medium"
                >
                  {secondTeamName || "Second Team"}
                </label>

                <input
                  id="secondTeamPlayers"
                  name="secondTeamPlayers"
                  type="number"
                  min="2"
                  max="11"
                  value={advanceData.secondTeamPlayers}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.secondTeamPlayers ? "input-error" : ""
                  }`}
                />

                {errors.secondTeamPlayers && (
                  <p className="mt-1 text-xs text-error">
                    {errors.secondTeamPlayers}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="border-t border-base-content/10" />

          {/* Scoring rules */}
          <section>
            <h3 className="mb-1 text-sm font-semibold">Scoring Rules</h3>

            <p className="mb-3 text-xs text-base-content/50">
              Set the additional runs awarded for extras.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* No ball */}
              <div>
                <label
                  htmlFor="noBallRuns"
                  className="mb-1.5 block text-xs font-medium"
                >
                  No Ball Runs
                </label>

                <input
                  id="noBallRuns"
                  name="noBallRuns"
                  type="number"
                  min="0"
                  value={advanceData.noBallRuns}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.noBallRuns ? "input-error" : ""
                  }`}
                />

                {errors.noBallRuns && (
                  <p className="mt-1 text-xs text-error">{errors.noBallRuns}</p>
                )}
              </div>

              {/* Wide */}
              <div>
                <label
                  htmlFor="wideBallRuns"
                  className="mb-1.5 block text-xs font-medium"
                >
                  Wide Ball Runs
                </label>

                <input
                  id="wideBallRuns"
                  name="wideBallRuns"
                  type="number"
                  min="0"
                  value={advanceData.wideBallRuns}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.wideBallRuns ? "input-error" : ""
                  }`}
                />

                {errors.wideBallRuns && (
                  <p className="mt-1 text-xs text-error">
                    {errors.wideBallRuns}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-base-content/10 px-5 py-4">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveOption}
            className="btn btn-primary"
          >
            Save Options
          </button>
        </div>
      </div>
    </div>
  );
};
