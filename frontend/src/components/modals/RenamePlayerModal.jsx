import { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { ArrowLeft, Pencil } from "lucide-react";
import { renameCurrentPlayer } from "../../store/scoreSlice";

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be more than 2 letters")
  .max(15, "Name cannot exceed 15 characters")
  .refine((value) => !/^\d+$/.test(value), {
    message: "Name cannot contain only digits",
  })
  .refine((value) => (value.match(/[A-Za-z]/g) || []).length >= 3, {
    message: "Name must contain at least 3 letters",
  });

export const RenamePlayerModal = ({ position, currentName, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(currentName || "");
  const [error, setError] = useState("");

  const positionLabel =
    position === "striker"
      ? "Striker"
      : position === "nonStriker"
        ? "Non-Striker"
        : "Bowler";

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = nameSchema.safeParse(name);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid name");
      return;
    }

    dispatch(renameCurrentPlayer({ position, name: result.data }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-base-100 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-base-content/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-base-content/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Pencil size={16} className="opacity-60" />
              Edit {positionLabel} Name
            </h2>
            <p className="text-xs text-base-content/50">
              Update the name of the current {positionLabel.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="px-4 py-4">
          <label
            htmlFor="playerName"
            className="mb-2 block text-sm font-medium"
          >
            {positionLabel} name
          </label>

          <input
            id="playerName"
            type="text"
            value={name}
            maxLength={15}
            autoFocus
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className="h-11 w-full rounded-xl border border-base-content/15 bg-base-100 px-3 text-sm outline-none focus:border-blue-500"
            placeholder={`Enter ${positionLabel.toLowerCase()} name`}
          />

          {error && <p className="mt-2 text-xs text-error">{error}</p>}
        </div>

        <div className="flex gap-2 border-t border-base-content/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost h-10 min-h-10 flex-1 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-info h-10 min-h-10 flex-1 rounded-xl"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
