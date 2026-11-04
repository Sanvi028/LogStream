
import { io } from "socket.io-client";

console.log("SOCKET FILE LOADED");

// Use the same origin as the frontend.
// In Docker, Nginx forwards /socket.io/ to the backend.
const SOCKET_URL = window.location.origin;

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
