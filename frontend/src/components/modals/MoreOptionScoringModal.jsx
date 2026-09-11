import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import {
  X,
  UserRound,
  UserRoundX,
  ArrowLeftRight,
  ChevronRight,
  Search,
} from "lucide-react";
import { retireBatsman, replaceBatsman } from "../../store/scoreSlice";

export const MoreOptionScoringModal = ({ onClose }) => {
  const [activeOption, setActiveOption] = useState(null);
  const [retiringPosition, setRetiringPosition] = useState("striker");
  const [selectedNewPlayer, setSelectedNewPlayer] = useState(null);
  const [search, setSearch] = useState("");
  const [replacePosition, setReplacePosition] = useState("striker");

  const dispatch = useDispatch();
  const { currentMatchData } = useSelector((state) => state.score);
  const { teams } = useSelector((state) => state.localTeam);

  const currentInning =
    currentMatchData?.innings?.[currentMatchData?.currentInning - 1];
  const striker = currentMatchData?.currentPlayers?.striker;
  const nonStriker = currentMatchData?.currentPlayers?.nonStriker;

  const getPlayerId = (player) => player?.id ?? player?.playerId ?? "";

  // Get batting team players
  const battingTeamId = currentInning?.battingTeamId;
  const battingTeam = teams?.find((t) => t.teamId === battingTeamId);
  const battingTeamPlayers = battingTeam?.players || [];

  // Get IDs of players who can't be selected
  const strikerId = getPlayerId(striker);
  const nonStrikerId = getPlayerId(nonStriker);
  const outPlayerIds = (currentInning?.outPlayers || []).map(
    (p) => p.playerId || p.id || "",
  );

  // For retire hurt: retired hurt players CAN come back
  const retiredHurtPlayers = currentInning?.retiredHurtPlayers || [];
  const retiredHurtIds = retiredHurtPlayers.map(
    (p) => p.playerId || p.id || "",
  );

  // Available players = team roster minus current batsmen, minus out players
  // For replacement after retire/replace: include retired hurt players (they can return)
  const getAvailablePlayers = (includeRetiredHurt = false) => {
    const basePlayers = battingTeamPlayers.filter((player) => {
      const playerId = getPlayerId(player);
      return (
        playerId !== strikerId &&
        playerId !== nonStrikerId &&
        !outPlayerIds.includes(playerId)
      );
    });

    if (includeRetiredHurt && retiredHurtPlayers.length > 0) {
      // Add retired hurt players back with a tag
      const retiredHurtForSelection = retiredHurtPlayers
        .filter((p) => {
          const pid = p.playerId || p.id || "";
          return pid !== strikerId && pid !== nonStrikerId;
        })
        .map((p) => ({
          ...p,
          playerId: p.playerId || p.id,
          isRetiredHurt: true,
        }));

      return [...retiredHurtForSelection, ...basePlayers.filter(
        (p) => !retiredHurtIds.includes(getPlayerId(p)),
      )];
    }

    return basePlayers.filter(
      (p) => !retiredHurtIds.includes(getPlayerId(p)),
    );
  };

  const availablePlayers = getAvailablePlayers(true);

  const filteredPlayers = search.trim()
    ? availablePlayers.filter((p) =>
        p?.name?.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : availablePlayers;

  // Create new player helper
  const createPlayer = (name) => ({
    playerId: nanoid(),
    name: name.trim(),
    matches: 0,
    battingStats: {
      innings: 0, notOut: 0, runs: 0, balls: 0, bestScore: 0,
      average: 0, strikeRate: 0, thirties: 0, fifties: 0,
      hundreds: 0, ducks: 0, fours: 0, sixes: 0,
    },
    bowlingStats: {
      innings: 0, balls: 0, runs: 0, wickets: 0, bestBowling: "0/0",
      average: 0, economy: 0, strikeRate: 0, maidens: 0,
      threeWickets: 0, fiveWickets: 0, wides: 0, noBalls: 0, dotBalls: 0,
    },
  });

  const handleConfirmRetire = () => {
    if (!selectedNewPlayer) return;

    dispatch(
      retireBatsman({
        retiringPosition,
        retireType: activeOption, // "retired-hurt" or "retired-out"
        newBatsman: selectedNewPlayer,
      }),
    );
    onClose();
  };

  const handleConfirmReplace = () => {
    if (!selectedNewPlayer) return;

    dispatch(
      replaceBatsman({
        position: replacePosition,
        newBatsman: selectedNewPlayer,
      }),
    );
    onClose();
  };

  const handleSelectPlayer = (player) => {
    setSelectedNewPlayer(player);
    setSearch(player.name);
  };

  const handleAddNewPlayer = () => {
    if (!search.trim()) return;
    const newPlayer = createPlayer(search);
    setSelectedNewPlayer(newPlayer);
  };

  const resetSelection = () => {
    setSelectedNewPlayer(null);
    setSearch("");
  };

  const options = [
    {
      id: "retired-hurt",
      title: "Retired Hurt",
      description: "Retire due to injury. No wicket falls. Player can return.",
      icon: UserRoundX,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: "retired-out",
      title: "Retired Out",
      description: "Voluntary retirement. Counts as a wicket. Cannot return.",
      icon: UserRound,
      color: "text-error",
      bgColor: "bg-error/10",
    },
    {
      id: "replace",
      title: "Replace Batsman",
      description: "Swap a current batsman for another available player.",
      icon: ArrowLeftRight,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  const renderPlayerSelection = () => (
    <div className="space-y-3 mt-4">
      <label className="text-sm font-medium">Select replacement player</label>

      <div className="relative">
        <label className="input input-bordered flex h-11 items-center gap-2 rounded-xl">
          <Search size={17} className="text-base-content/40" />
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedNewPlayer(null);
            }}
            className="grow text-sm"
          />
        </label>
      </div>

      <div className="max-h-40 overflow-y-auto rounded-xl border border-base-content/10">
        {filteredPlayers.length > 0 ? (
          <ul className="divide-y divide-base-content/5">
            {filteredPlayers.map((player) => {
              const pid = getPlayerId(player);
              const isSelected = selectedNewPlayer && getPlayerId(selectedNewPlayer) === pid;

              return (
                <li
                  key={pid || player.name}
                  onClick={() => handleSelectPlayer(player)}
                  className={`px-3 py-2.5 cursor-pointer transition-colors text-sm ${
                    isSelected
                      ? "bg-primary/15 text-primary font-semibold"
                      : "hover:bg-base-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{player.name}</span>
                    {player.isRetiredHurt && (
                      <span className="text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                        Retired Hurt
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : search.trim() ? (
          <div className="p-3 text-sm text-base-content/50">
            <p>No player found.</p>
            <button
              onClick={handleAddNewPlayer}
              className="btn btn-sm btn-info mt-2"
            >
              Add "{search.trim()}" as new player
            </button>
          </div>
        ) : (
          <div className="p-3 text-sm text-base-content/40 italic">
            No available players
          </div>
        )}
      </div>
    </div>
  );

  const renderRetirement = () => (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => { setActiveOption(null); resetSelection(); }}
          className="btn btn-ghost btn-sm -ml-2 gap-1"
        >
          <ChevronRight className="rotate-180" size={17} />
          Back
        </button>

        <h2 className="text-xl font-bold mt-2">
          {activeOption === "retired-hurt" ? "Retired Hurt" : "Retired Out"}
        </h2>

        <p className="text-sm text-base-content/50 mt-1">
          {activeOption === "retired-hurt"
            ? "Player leaves due to injury. No wicket falls and they can return to bat later."
            : "Player voluntarily retires. This counts as a wicket and they cannot bat again."}
        </p>
      </div>

      {/* Who is retiring? */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Which player is retiring?</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setRetiringPosition("striker"); resetSelection(); }}
            className={`rounded-xl border p-3 text-sm font-medium transition-all ${
              retiringPosition === "striker"
                ? "border-primary bg-primary/10 text-primary"
                : "border-base-300 hover:border-primary/40"
            }`}
          >
            <div className="font-semibold">{striker?.name || "Striker"}</div>
            <div className="text-xs opacity-60 mt-0.5">
              {striker?.battingStats?.runs || 0} ({striker?.battingStats?.balls || 0})
            </div>
          </button>

          <button
            onClick={() => { setRetiringPosition("nonStriker"); resetSelection(); }}
            className={`rounded-xl border p-3 text-sm font-medium transition-all ${
              retiringPosition === "nonStriker"
                ? "border-primary bg-primary/10 text-primary"
                : "border-base-300 hover:border-primary/40"
            }`}
          >
            <div className="font-semibold">{nonStriker?.name || "Non-Striker"}</div>
            <div className="text-xs opacity-60 mt-0.5">
              {nonStriker?.battingStats?.runs || 0} ({nonStriker?.battingStats?.balls || 0})
            </div>
          </button>
        </div>
      </div>

      {renderPlayerSelection()}

      <button
        onClick={handleConfirmRetire}
        disabled={!selectedNewPlayer}
        className={`btn w-full h-12 rounded-xl ${
          activeOption === "retired-hurt" ? "btn-warning" : "btn-error"
        }`}
      >
        Confirm {activeOption === "retired-hurt" ? "Retired Hurt" : "Retired Out"}
      </button>
    </div>
  );

  const renderReplacement = () => (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => { setActiveOption(null); resetSelection(); }}
          className="btn btn-ghost btn-sm -ml-2 gap-1"
        >
          <ChevronRight className="rotate-180" size={17} />
          Back
        </button>

        <h2 className="text-xl font-bold mt-2">Replace Batsman</h2>

        <p className="text-sm text-base-content/50 mt-1">
          Swap a current batsman for another available player. No wicket or stats change.
        </p>
      </div>

      {/* Who to replace? */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Which batsman to replace?</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setReplacePosition("striker"); resetSelection(); }}
            className={`rounded-xl border p-3 text-sm font-medium transition-all ${
              replacePosition === "striker"
                ? "border-info bg-info/10 text-info"
                : "border-base-300 hover:border-info/40"
            }`}
          >
            <div className="font-semibold">{striker?.name || "Striker"}</div>
            <div className="text-xs opacity-60 mt-0.5">Striker</div>
          </button>

          <button
            onClick={() => { setReplacePosition("nonStriker"); resetSelection(); }}
            className={`rounded-xl border p-3 text-sm font-medium transition-all ${
              replacePosition === "nonStriker"
                ? "border-info bg-info/10 text-info"
                : "border-base-300 hover:border-info/40"
            }`}
          >
            <div className="font-semibold">{nonStriker?.name || "Non-Striker"}</div>
            <div className="text-xs opacity-60 mt-0.5">Non-Striker</div>
          </button>
        </div>
      </div>

      {renderPlayerSelection()}

      <button
        onClick={handleConfirmReplace}
        disabled={!selectedNewPlayer}
        className="btn btn-info w-full h-12 rounded-xl"
      >
        Confirm Replacement
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center backdrop-blur-md p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-base-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col border-t-2 border-base-content/15">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300/70">
          <div>
            <h1 className="text-lg font-bold">
              {activeOption ? "Player Options" : "More Options"}
            </h1>

            {!activeOption && (
              <p className="text-xs text-base-content/50 mt-0.5">
                Manage players during the innings
              </p>
            )}
          </div>

          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5">
          {!activeOption && (
            <div className="space-y-3">
              {options.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setActiveOption(option.id);
                      resetSelection();
                    }}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-base-300/70 bg-base-200/30 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${option.bgColor} ${option.color} transition-colors`}>
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm">{option.title}</h3>

                      <p className="mt-0.5 text-xs leading-relaxed text-base-content/50">
                        {option.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-base-content/30 group-hover:text-primary transition-colors"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {(activeOption === "retired-hurt" ||
            activeOption === "retired-out") &&
            renderRetirement()}

          {activeOption === "replace" && renderReplacement()}
        </div>
      </div>
    </div>
  );
};
