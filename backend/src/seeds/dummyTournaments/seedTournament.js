import { Tournament } from "../../models/tournamentSchema.js";
import { createFakeTournament } from "./createDummyTournaments.js";

export const seedTournament = async () => {
  const tournaments = [];

  for (let i = 0; i <= 100; i++) {
    tournaments.push(createFakeTournament());
  }
  await Tournament.insertMany(tournaments);

  console.log("✅ Tournaments seeded");
};
