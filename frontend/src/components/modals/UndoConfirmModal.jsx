import { RotateCcw } from "lucide-react";

export const UndoConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed z-[999999] inset-0 h-dvh overflow-hidden flex items-center justify-center backdrop-blur-sm bg-black/10 p-4">
      <div className="rounded-2xl flex flex-col items-center gap-6 p-5 w-[90%] md:w-[60%] lg:w-[40%] border border-base-content/20 bg-base-100">
        <div className="bg-yellow-300 p-2 rounded-full">
          <RotateCcw strokeWidth={3} className="text-yellow-700" />
        </div>

        <h1 className="font-black text-2xl">Are You Sure?</h1>

        <p className="font-bold text-center">
          Are you sure you want to undo the last delivery? This will revert the
          score to the previous ball.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={onConfirm}
            className="btn btn-warning rounded-md"
            type="button"
          >
            Undo
          </button>

          <button
            onClick={onCancel}
            className="btn btn-accent rounded-md"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};