import jwt from "jsonwebtoken";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";

export const isAuthenticated = (req, res, next) => {
  try {
    const { crickAuthToken } = req.cookies;

    if (!crickAuthToken)
      return next(new CustomErrHandler(400, "Please Login first"));
    const decoded = jwt.verify(crickAuthToken, process.env.SECRET_JWT_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Authentication Error : ", error);
    next(error);
  }
};
