

export const SwapConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed z-[999999] inset-0 h-dvh overflow-hidden flex items-center justify-center backdrop-blur-sm bg-black/10 p-4">
      <div className="rounded-2xl flex flex-col items-center gap-5 p-5 w-[90%] md:w-[60%] lg:w-[40%] border border-base-content/20 bg-base-100 shadow-xl">
        <div className="flex flex-col items-center gap-2">
         
          <h1 className="font-black text-2xl">Swap Players?</h1>
          <p className="text-center text-base-content/70 text-sm">
            Do you want to swap the striker and non-striker?
          </p>
        </div>

        {/* Player preview */}
        <div className="flex items-center gap-3 w-full justify-center">
         
        </div>

        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onCancel}
            className="btn btn-neutral rounded-md flex-1"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-info rounded-md flex-1"
            type="button"
          >
            Yes, Swap
          </button>
        </div>
      </div>
    </div>
  );
};
