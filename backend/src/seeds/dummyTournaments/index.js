import { connectMongoDB } from "../../utils/connectMongoDB.js";

import { seedTournament } from "./seedTournament.js";
import dotenv from "dotenv";
dotenv.config();
const runSeed = async () => {
  await connectMongoDB();
  await seedTournament();
  process.exit();
};

runSeed();
console.log("Seed runs");
