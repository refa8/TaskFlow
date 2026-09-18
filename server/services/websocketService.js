const jwt = require("jsonwebtoken");

let wss = null;

const initializeWebSocket = (webSocketServer) => {
  wss = webSocketServer;
};

const authenticateSocket = (socket, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    socket.send(
      JSON.stringify({
        type: "authenticated",
        message: "Authentication successful",
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        },
      }),
    );

    return true;
  } catch (error) {
    socket.send(
      JSON.stringify({
        type: "authentication_failed",
        message: "Invalid or expired token",
      }),
    );
    socket.close();
    return false;
  }
};
const broadcastMessage = (message) => {
  if (!wss) {
    return;
  }
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const sendToUser = (userid, message) => {
  if (!wss) {
    return;
  }
  wss.clients.forEach((client) => {
    if (
      client.readyState === client.OPEN &&
      client.user &&
      client.user.id === userid
    ) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = {
  initializeWebSocket,
  authenticateSocket,
  broadcastMessage,
  sendToUser,
};
