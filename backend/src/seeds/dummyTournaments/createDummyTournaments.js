import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

export const createFakeTournament = () => {
  return {
    _id: new mongoose.Types.ObjectId(),
    tournamentName: faker.company.name(),
    organiserName: faker.person.fullName(),
    phone: faker.string.numeric(10),
    status: faker.helpers.arrayElement([
      "Upcoming",
      "Ongoing",
      "Completed",
      "Cancelled",
    ]),
    createdBy: new mongoose.Types.ObjectId("698c2fbad02a0ffa3fe219c5"),
    admins: [new mongoose.Types.ObjectId("698c2fbad02a0ffa3fe219c5")],
    TournamentLogo: faker.image.url(),
    tournamentBanner: faker.image.url(),
    city: faker.location.city(),
    ground: faker.location.street(),
    startDate: faker.date.soon(),
    endDate: faker.date.soon(30),
    ballType: faker.helpers.arrayElement([
      "Bunat",
      "Red Ball",
      "Swing Ball",
      "Tennis",
      "Leather",
      "Other",
    ]),
    tournamentCategory: faker.helpers.arrayElement([
      "open",
      "panchayat",
      "panchayat+open",
      "corporate",
    ]),
    pitchType: faker.helpers.arrayElement(["Regular", "Cement", "Matte"]),
    additionalInfo: faker.lorem.sentence(),
  };
};
