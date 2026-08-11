import { io } from "socket.io-client";

let socket;

export const createSocket = () => {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_BACKEND_BASE_URL}`, {
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
