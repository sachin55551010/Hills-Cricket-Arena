import { user_route } from "./routes/user.route.js";
import { connectMongoDB } from "./utils/connectMongoDB.js";
import { server, app, io } from "./utils/socket.js";
import "./utils/passport.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errHandlerMiddleware } from "./middlewares/errhandlerMiddleware.js";
import { auth_router } from "./routes/auth.route.js";
import { tournament_route } from "./routes/tournament.route.js";
import { team_route } from "./routes/team.route.js";
import { player_router } from "./routes/player.route.js";
import { inviteLink_route } from "./routes/inviteLink.route.js";
import { match_route } from "./routes/match.route.js";

const PORT = process.env.PORT; // local host port

//* implemented cors policy in app
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

//? express middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
//* default route
app.get("/", async (_, res) => {
  try {
    const response = await fetch(process.env.CRICKET_NEWS_URI);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

//? routes

app.use("/api/v1/user", user_route);
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/tournament", tournament_route);
app.use("/api/v1/team", team_route);
app.use("/api/v1/player", player_router);
app.use("/api/v1/match", match_route);
app.use("/api/v1/invite", inviteLink_route);
connectMongoDB();

//?implementing socket.io
io.on("connect", () => {
  io.emit("message", "Helloooo");
});
server.listen(PORT, () => console.log(`Server running on port : ${PORT}`));

app.use(errHandlerMiddleware); // error handler function
