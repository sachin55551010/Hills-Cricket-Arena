import express from "express";
import { Server } from "socket.io";
import { config } from "dotenv";
import http from "http";
config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

export { app, server, io };
