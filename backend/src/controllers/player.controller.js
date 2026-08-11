import { Player } from "../models/playerSchema.js";
export const createPlayer = async (req, res, next) => {
  try {
    const { id } = req.user;

    console.log(id);
  } catch (error) {
    console.log("create player error: ", error);
    next(error);
  }
};
