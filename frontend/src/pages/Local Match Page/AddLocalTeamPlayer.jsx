import { useState } from "react";
import { useParams } from "react-router-dom";
import { RiUserAddFill } from "react-icons/ri";
import { Pencil, Trash2, X } from "lucide-react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { Header } from "../../components/Header";

// Player validation schema

const playerNameSchema = z
  .string()
  .trim()
  .min(1, "Player name is required")
  .refine((name) => !/^\d+$/.test(name), {
    message: "Player name cannot contain only numbers",
  });

export const AddLocalTeamPlayer = () => {
  const { teamId } = useParams();

  const [localTeams, setLocalTeams] = useState(() => {
    return JSON.parse(localStorage.getItem("localTeams")) || [];
  });

  const [modalType, setModalType] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  // Find team using teamId

  const localTeam = localTeams.find((team) => team.teamId === teamId);
  console.log(localTeam);

  // Open Add Player Modal

  const handleAddPlayer = () => {
    setPlayerName("");
    setError("");
    setSelectedPlayer(null);
    setModalType("add");
  };

  // Add Player

  const handleSavePlayer = () => {
    setError("");

    // Zod validation
    const result = playerNameSchema.safeParse(playerName);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const trimmedName = result.data;

    // Check duplicate player name
    const isDuplicate = localTeam?.players?.some(
      (player) =>
        player.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setError(
        "A player with this name already exists please choose different name of add sirname",
      );
      return;
    }

    // Create new player
    const newPlayer = {
      playerId: nanoid(),
      name: trimmedName,
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
    };

    // Add player to correct team
    const updatedTeams = localTeams.map((team) => {
      if (team.teamId !== teamId) return team;

      return {
        ...team,
        players: [...(team.players || []), newPlayer],
      };
    });

    setLocalTeams(updatedTeams);

    localStorage.setItem("localTeams", JSON.stringify(updatedTeams));

    closeModal();
  };

  // Open Edit Player Modal

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setPlayerName(player.name);
    setError("");
    setModalType("edit");
  };

  // Update Player

  const handleUpdatePlayer = () => {
    setError("");

    if (!selectedPlayer) return;

    // Zod validation
    const result = playerNameSchema.safeParse(playerName);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const trimmedName = result.data;

    // Check duplicate name excluding current player
    const isDuplicate = localTeam?.players?.some(
      (player) =>
        player.playerId !== selectedPlayer.playerId &&
        player.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setError("A player with this name already exists");
      return;
    }

    // Update player inside correct team
    const updatedTeams = localTeams.map((team) => {
      if (team.teamId !== teamId) return team;

      return {
        ...team,
        players: team.players.map((player) =>
          player.playerId === selectedPlayer.playerId
            ? {
                ...player,
                name: trimmedName,
              }
            : player,
        ),
      };
    });

    setLocalTeams(updatedTeams);

    localStorage.setItem("localTeams", JSON.stringify(updatedTeams));
    localStorage.setItem("currentMatch", JSON.stringify(updatedTeams));
    closeModal();
  };

  // Open Delete Player Modal

  const handleDeletePlayer = (player) => {
    setSelectedPlayer(player);
    setError("");
    setModalType("delete");
  };

  // Delete Player

  const confirmDeletePlayer = () => {
    if (!selectedPlayer) return;

    const updatedTeams = localTeams.map((team) => {
      if (team.teamId !== teamId) return team;

      return {
        ...team,
        players: team.players.filter(
          (player) => player.playerId !== selectedPlayer.playerId,
        ),
      };
    });

    setLocalTeams(updatedTeams);

    localStorage.setItem("localTeams", JSON.stringify(updatedTeams));

    closeModal();
  };

  // Close Modal

  const closeModal = () => {
    setModalType(null);
    setSelectedPlayer(null);
    setPlayerName("");
    setError("");
  };

  // Submit Add/Edit using Enter

  const handleSubmit = () => {
    if (modalType === "add") {
      handleSavePlayer();
    }

    if (modalType === "edit") {
      handleUpdatePlayer();
    }
  };

  return (
    <div className="h-dvh w-screen pt-12 flex justify-center relative">
      <Header data="Team details" />

      <div className="w-[98%] lg:w-[60%] mt-4">
        {/* Team Name */}
        <h1 className="text-2xl font-bold mb-5">
          {localTeam?.name || "Team not found"}
        </h1>

        {/* Players */}
        <div className="space-y-3">
          {localTeam?.players?.length > 0 ? (
            localTeam.players.map((player) => (
              <div
                key={player.playerId}
                className="p-4 rounded-xl bg-base-200 flex items-center justify-between"
              >
                {/* Player Name */}
                <span className="font-medium">{player.name}</span>

                {/* Player Actions */}
                <div className="flex items-center gap-1">
                  {/* Edit */}
                  <button
                    onClick={() => handleEditPlayer(player)}
                    className="btn btn-ghost btn-sm btn-square"
                    title="Edit player"
                  >
                    <Pencil size={17} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeletePlayer(player)}
                    className="btn btn-ghost btn-sm btn-square text-error"
                    title="Delete player"
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

        {/* Add Player Button */}
        <button
          onClick={handleAddPlayer}
          className="fixed bottom-5 right-5 h-15 w-15 rounded-full flex items-center justify-center bg-base-100 shadow-[0px_0px_15px_rgba(0,0,0,1)] cursor-pointer"
        >
          <RiUserAddFill size={20} />
        </button>
      </div>

      {/* 
          ADD / EDIT PLAYER MODAL
     */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">
                {modalType === "add" ? "Add player" : "Edit player"}
              </h2>

              <button
                onClick={closeModal}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={18} />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);

                // Remove old validation error while typing
                if (error) {
                  setError("");
                }
              }}
              className={`input input-bordered w-full ${
                error ? "input-error" : ""
              }`}
              placeholder="Enter player name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />

            {/* Error */}
            {error && <p className="text-error text-sm mt-2">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="btn btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="btn btn-primary flex-1 rounded-xl"
              >
                {modalType === "add" ? "Add player" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
          DELETE PLAYER MODAL
      */}
      {modalType === "delete" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Delete player?</h2>

              <button
                onClick={closeModal}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={18} />
              </button>
            </div>

            {/* Confirmation */}
            <p className="text-base-content/60 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-base-content">
                {selectedPlayer?.name}
              </span>
              ?
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="btn btn-ghost flex-1 rounded-xl"
              >
                Cancel
              </button>

              <button
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
