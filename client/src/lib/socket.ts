
import { io } from "socket.io-client";

console.log("SOCKET FILE LOADED");

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api(?:\/v1)?\/?$/, "") ||
  "http://localhost:5000";

console.log("SOCKET URL:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("SOCKET CONNECTION ERROR:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("SOCKET DISCONNECTED:", reason);
});
