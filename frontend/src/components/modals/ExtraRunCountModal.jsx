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
      // Only relevant for no-ball
      ...(extraType === "NB" && {
        runType: nbRunType,
      }),
    };
    if (isWicket) {
      setPendingData(data);
      setShowOutModal(true);
      return;
    }
    if (pendingData) {
      const updatedData = { ...pendingData, ...updatedData };
      onConfirm(updatedData);
    } else {
      onConfirm(data);
      onClose();
    }
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
          <div>
            <p className="text-sm text-base-content/60 mb-4">
              {config.description}
            </p>

            {extraType === "NB" && (
              <div className="mb-4 flex justify-between">
                <label className="flex w-fit flex-col gap-2">
                  From Bat
                  <input
                    type="radio"
                    name="nbRunType"
                    value="BAT"
                    checked={nbRunType === "BAT"}
                    onChange={(e) => setNbRunType(e.target.value)}
                    className="h-4 w-4"
                  />
                </label>

                <label className="flex w-fit flex-col gap-2">
                  Bye
                  <input
                    type="radio"
                    name="nbRunType"
                    value="BYE"
                    checked={nbRunType === "BYE"}
                    onChange={(e) => setNbRunType(e.target.value)}
                    className="h-4 w-4"
                  />
                </label>

                <label className="flex w-fit flex-col gap-2">
                  Leg Bye
                  <input
                    type="radio"
                    name="nbRunType"
                    value="LB"
                    checked={nbRunType === "LB"}
                    onChange={(e) => setNbRunType(e.target.value)}
                    className="h-4 w-4"
                  />
                </label>
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
            onConfirm({
              ...pendingData,
              ...outData,
            });
          }}
        />
      )}
    </div>
  );
};
