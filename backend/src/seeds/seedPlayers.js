import { Player } from "../models/playerSchema.js";
import { createFakePlayer } from "./createFakePlayers.js";

export async function seedPlayers() {
  const players = [];

  for (let i = 0; i < 100; i++) {
    // example role logic
    const role = i < 20 ? "organiser" : "user";

    players.push(createFakePlayer(role));
  }

  await Player.insertMany(players);

  console.log("✅ Players seeded");
}
