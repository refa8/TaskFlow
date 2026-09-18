const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const {
  initializeWebSocket,
  authenticateSocket,
  sendToUser,
} = require("./services/websocketService");
// const pool = require("./config/db");
const app = express();
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const port = 5000;

app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

initializeWebSocket(wss);
wss.on("connection", (socket) => {
  console.log("A client connected to the WebSocket server");

  socket.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to TaskFlow WebSocket server",
    }),
  );

  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "authenticate") {
        const authenticated = authenticateSocket(socket, message.token);
        if (authenticated) {
          sendToUser(socket.user.id, {
            type: "authentication_successful",
            message: `Hello ${socket.user.username}!`,
          });
        }
      }
    } catch (error) {
      socket.send(
        JSON.stringify({
          type: "authentication_failed",
          message: "Invalid message format",
        }),
      );
    }
  });

  socket.on("close", () => {
    console.log("A client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
