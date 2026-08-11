import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

export function createFakePlayer(role) {
  return {
    _id: new mongoose.Types.ObjectId(),
    playerName: faker.person.fullName(),
    dateOfBirth: faker.date.birthdate({
      min: 18,
      max: 40,
      mode: "age",
    }),

    profilePicture: faker.image.avatar(),

    playerId: new mongoose.Types.ObjectId(),

    isVarified: true,

    role: role,

    careerStats: {
      batting: {
        runs: faker.number.int({ min: 0, max: 10000 }),
        average: faker.number.float({ min: 10, max: 60 }),
      },
      bowling: {
        wickets: faker.number.int({ min: 0, max: 500 }),
      },
      matches: faker.number.int({ min: 0, max: 300 }),
    },

    gender: "male",

    number: faker.string.numeric(10),
  };
}
