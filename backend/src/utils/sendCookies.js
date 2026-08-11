import jwt from "jsonwebtoken";
export const sendCookies = (user, res, next) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT_KEY);

    return res.status(200).cookie("crickAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.log("Google login error", error);
    next(error);
  }
};
