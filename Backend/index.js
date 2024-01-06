const express = require("express");
const app = express();

const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.static("public"));

const PORT = process.env.PORT || 4000;
app.use(cors());
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const rooms = {};

socketIO.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", ({ username, room }) => {
    console.log("data recieved in backend", username, room);
    socket.join(room);

    socketIO.to(room).emit("notification", `${username} joined the room`);

    console.log("message history", rooms[room], "message", rooms);
    if (rooms[room]) {
      socket.emit("messageHistory", rooms[room]);
    }

    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(`${username} joined the room`);
  });

  socket.on("sendMessage", ({ username, room, message }) => {
    console.log("emit of data message in sendmessage", username, room, message);
    socketIO.to(room).emit("message", { username, message });

    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push({ username, message });

    if (rooms[room].length > 10) {
      rooms[room].shift();
    }
  });

  socket.on("sendPrivateMessage", ({ from, to, message }) => {
    const senderRoom = Object.keys(socket.rooms)[1];
    const receiver = socketIO.sockets.sockets.get(to);

    if (receiver && receiver.rooms.has(senderRoom)) {
      socket.to(to).emit("privateMessage", { from, message });
    } else {
      socket.emit("privateMessage", {
        from: "System",
        message: "User is not in the same room",
      });
    }
  });

  socket.on("typing", ({ username, room }) => {
    socket.broadcast.to(room).emit("typing", `${username} is typing...`);
  });
  socket.on("stoptyping", ({ username, room }) => {
    socket.broadcast.to(room).emit("stoptyping", `${username} stopped typing.`);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
