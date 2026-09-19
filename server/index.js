require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const {
  initializeWebSocket,
  authenticateSocket,
  sendToUser,
} = require("./services/websocketService");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const port = 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set");
  process.exit(1);
}

app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/activity-logs", activityLogRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

initializeWebSocket(wss);
wss.on("connection", (socket) => {
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
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
