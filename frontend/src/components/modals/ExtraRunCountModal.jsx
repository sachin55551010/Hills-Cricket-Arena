import { useState } from "react";
import { OutModal } from "./OutModal";

export const ExtraRunCountModal = ({
  extraType,
  onClose,
  onConfirm,
  showOutModal,
  setShowOutModal,
}) => {
  const [runs, setRuns] = useState("");
  const [isWicket, setIsWicket] = useState(false);

  const [pendingData, setPendingData] = useState(null);
  const [nbRunType, setNbRunType] = useState("BAT");

  const extraConfig = {
    WD: {
      label: "Wide",
      description: "Any bye runs?",
      min: 0,
      max: 7,
    },
    NB: {
      label: "No Ball",
      description: "Any extra runs on no ball?",
      min: 0,
      max: 7,
    },
    BYE: {
      label: "Bye",
      description: "Choose Bye runs",
      min: 1,
      max: 7,
    },
    LB: {
      label: "Leg Bye",
      description: "Choose Leg bye runs",
      min: 1,
      max: 7,
    },
  };

  const config = extraConfig[extraType];

  if (!config) return null;

  const runOptions = Array.from(
    { length: config.max - config.min + 1 },
    (_, index) => index + config.min,
  );

  const handleConfirm = () => {
    const data = {
      type: extraType,
      runs: Number(runs),
      wicket: isWicket,

      ...(extraType === "NB" && {
        runType: nbRunType,
      }),
    };

    // EXTRA + WICKET

    if (isWicket) {
      setPendingData(data);
      setShowOutModal(true);
      return;
    }

    // EXTRA WITHOUT WICKET

    onConfirm(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex h-dvh w-screen items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-2xl">
        {/* Header */}
        <div className="border-b border-base-content/10 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{config.label}</h2>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-base-content/60 transition hover:bg-base-content/10 hover:text-base-content"
            >
              ×
            </button>
          </div>
        </div>

        {/* Runs */}
        <div className="p-5">
          <div className="mb-4">
            <p className="text-sm text-base-content/60 mb-4">
              {config.description}
            </p>

            {extraType === "NB" && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "BAT", label: "From Bat" },
                  { value: "BYE", label: "Bye" },
                  { value: "LB", label: "Leg Bye" },
                ].map((option) => {
                  const isSelected = nbRunType === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`
              relative flex cursor-pointer items-center justify-center
              rounded-lg border px-3 py-3
              text-sm font-medium
              transition-all duration-200
              ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-base-300 bg-base-100 text-base-content/60 hover:border-primary/40 hover:bg-base-200/40"
              }
            `}
                    >
                      <input
                        type="radio"
                        name="nbRunType"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => setNbRunType(e.target.value)}
                        className="sr-only"
                      />

                      {option.label}

                      {isSelected && (
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {runOptions.map((run) => (
              <button
                key={run}
                onClick={() => setRuns(run)}
                className={`h-12 rounded-xl border text-base font-semibold transition active:scale-95 ${
                  runs === run
                    ? "border-primary bg-primary text-primary-content shadow-sm"
                    : "border-base-content/10 bg-base-200 hover:border-primary/40 hover:bg-base-300"
                }`}
              >
                {run}
              </button>
            ))}
          </div>

          {/* Wicket */}
          <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-base-content/10 bg-base-200 p-4">
            <div>
              <p className="font-medium">Wicket</p>
              <p className="text-xs text-base-content/60">
                Was a batsman dismissed on this ball?
              </p>
            </div>

            <input
              type="checkbox"
              checked={isWicket}
              onChange={(e) => setIsWicket(e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-base-content/10 p-4">
          <button onClick={onClose} className="btn btn-ghost flex-1">
            Cancel
          </button>

          <button onClick={handleConfirm} className="btn btn-primary flex-1">
            {isWicket ? "Continue" : "Submit"}
          </button>
        </div>
      </div>
      {showOutModal && (
        <OutModal
          pendingData={pendingData}
          onClose={() => setShowOutModal(false)}
          onSubmit={(outData) => {
            const finalData = {
              ...pendingData,
              ...outData,
            };

            console.log("EXTRA + WICKET:", finalData);

            onConfirm(finalData);

            setShowOutModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};
