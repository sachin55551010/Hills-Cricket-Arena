import { useState } from "react";
import { RiUserAddFill } from "react-icons/ri";
import { Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import {
  addPlayerToTeam,
  deletePlayerFromTeam,
  updatePlayerInTeam,
} from "../../store/localTeamSlice";

const playerNameSchema = z
  .string()
  .trim()
  .min(3, "Player name must be at least 3 characters")
  .refine((name) => !/^\d+$/.test(name), {
    message: "Player name cannot contain only numbers",
  });

const createPlayer = (name) => ({
  playerId: nanoid(),
  name,
  matches: 0,
  battingStats: {
    innings: 0,
    notOut: 0,
    runs: 0,
    balls: 0,
    bestScore: 0,
    average: 0,
    strikeRate: 0,
    thirties: 0,
    fifties: 0,
    hundreds: 0,
    ducks: 0,
    fours: 0,
    sixes: 0,
  },
  bowlingStats: {
    innings: 0,
    balls: 0,
    runs: 0,
    wickets: 0,
    bestBowling: "0/0",
    average: 0,
    economy: 0,
    strikeRate: 0,
    maidens: 0,
    threeWickets: 0,
    fiveWickets: 0,
    wides: 0,
    noBalls: 0,
    dotBalls: 0,
  },
});
export const AddLocalTeamPlayer = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.localTeam.teams);
  const localTeam = teams.find((team) => team.teamId === teamId);

  const [modalType, setModalType] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const closeModal = () => {
    setModalType(null);
    setSelectedPlayer(null);
    setPlayerName("");
    setError("");
  };

  const hasDuplicateName = (name, excludedPlayerId) =>
    localTeam?.players?.some(
      (player) =>
        player.playerId !== excludedPlayerId &&
        player.name.trim().toLowerCase() === name.toLowerCase(),
    );

  const validatePlayerName = () => {
    const result = playerNameSchema.safeParse(playerName);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return null;
    }

    if (hasDuplicateName(result.data, selectedPlayer?.playerId)) {
      setError("A player with this name already exists.");
      return null;
    }

    return result.data;
  };
  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setPlayerName("");
    setError("");
    setModalType("add");
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setPlayerName(player.name);
    setError("");
    setModalType("edit");
  };

  const handleDeletePlayer = (player) => {
    setSelectedPlayer(player);
    setError("");
    setModalType("delete");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = validatePlayerName();

    if (!name || !localTeam) return;

    if (modalType === "add") {
      dispatch(addPlayerToTeam({ teamId, player: createPlayer(name) }));
    } else if (modalType === "edit" && selectedPlayer) {
      dispatch(
        updatePlayerInTeam({
          teamId,
          playerId: selectedPlayer.playerId,
          name,
        }),
      );
    }

    closeModal();
  };
  const confirmDeletePlayer = () => {
    if (!selectedPlayer || !localTeam) return;

    dispatch(
      deletePlayerFromTeam({
        teamId,
        playerId: selectedPlayer.playerId,
      }),
    );
    closeModal();
  };

  if (!localTeam) {
    return (
      <div className="h-dvh w-screen pt-12">
        <Header data="Team details" />
        <p className="mt-4 text-center text-base-content/60">Team not found.</p>
      </div>
    );
  }

  const isPlayerFormOpen = modalType === "add" || modalType === "edit";
  return (
    <div className="relative flex h-dvh w-screen justify-center pt-12">
      <Header data="Team details" />

      <div className="mt-4 w-[98%] lg:w-[60%]">
        <div className="flex items-center justify-between px-4">
          <h1 className="mb-5 text-2xl font-bold">{localTeam.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-[.85rem] font-semibold">Total Players</p>
            <span className="font-bold">{localTeam.players?.length ?? 0}</span>
          </div>
        </div>

        <div className="space-y-3">
          {localTeam.players?.length ? (
            localTeam.players.map((player) => (
              <div
                key={player.playerId}
                className="flex items-center justify-between rounded-xl border border-base-content/15 p-4"
              >
                <span className="font-medium">{player.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditPlayer(player)}
                    className="btn btn-ghost btn-sm btn-square"
                    aria-label={`Edit ${player.name}`}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlayer(player)}
                    className="btn btn-ghost btn-sm btn-square text-error"
                    aria-label={`Delete ${player.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-base-content/60">No players added yet.</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddPlayer}
          className="fixed bottom-5 right-5 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-base-100 shadow-[0_0_15px_rgba(0,0,0,1)]"
          aria-label="Add player"
        >
          <RiUserAddFill size={20} />
        </button>
      </div>
      {isPlayerFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <form
            className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {modalType === "add" ? "Add player" : "Edit player"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              value={playerName}
              onChange={(event) => {
                setPlayerName(event.target.value);
                if (error) setError("");
              }}
              className={`input input-bordered w-full ${error ? "input-error" : ""}`}
              placeholder="Enter player name"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "player-name-error" : undefined}
              autoFocus
            />
            {error && (
              <p id="player-name-error" className="mt-2 text-sm text-error">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 rounded-xl"
              >
                {modalType === "add" ? "Add player" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modalType === "delete" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Delete player?</h2>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="leading-relaxed text-base-content/60">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-base-content">
                {selectedPlayer?.name}
              </span>
              ?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePlayer}
                className="btn btn-error flex-1 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
