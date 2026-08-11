import { connectMongoDB } from "../utils/connectMongoDB.js";
import { seedPlayers } from "./seedPlayers.js";
import dotenv from "dotenv";
dotenv.config();
async function runSeed() {
  await connectMongoDB();

  await seedPlayers();

  process.exit();
}

runSeed();
