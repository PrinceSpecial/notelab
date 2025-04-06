import { Server } from "socket.io";
import http from "http";
import express from "express";
import axios from "axios";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("note:update", async (data) => {
    console.log("Note update received:", data);
    socket.broadcast.emit("note:update", data);

    try {
      const result = await axios.patch(
        `http://localhost:3000/api/notes/${data.noteId}`,
        data
      );
      const resultData = result.data.data;
      socket.emit("note:update:success", {
        noteId: resultData.id,
        updatedAt: resultData.updatedAt,
        lastUpdatedBy: resultData.lastUpdatedBy,
      });
      socket.broadcast.emit("note:update:success", {
        noteId: resultData.id,
        updatedAt: resultData.updatedAt,
        lastUpdatedBy: resultData.lastUpdatedBy,
      });
      console.log(resultData);
    } catch (err) {
      console.error("Failed to update note via API:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("WebSocket server running on http://localhost:4000");
});
