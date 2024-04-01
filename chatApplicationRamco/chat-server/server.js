const express = require("express");
const crypto = require("crypto");
const PORT = 8000;

const app = express();

const server = app.listen(PORT, () =>
  console.log(`Express server is running on port: ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeRoom = null;

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    // socket.join(userData._id);
    console.log(userData);
    socket.emit("connected");
  });

  socket.on("joinChat", (data) => {
    if (activeRoom === null || activeRoom?.length === 0) {
      var roomId = crypto.randomBytes(20).toString("hex");
      socket.join(roomId);
      activeRoom = roomId;
    } else {
      socket.join(activeRoom);
    }
    console.log("Joined Room", activeRoom);
    socket.to(activeRoom).emit("userJoined", {
      data: `${data?.userName} Joined the room`,
    });
  });

  socket.on("sendMessage", (data) => {
    console.log("message data", data);
    if (activeRoom !== null) {
      // if (currentUserName == data.userName) return;
      socket.to(activeRoom).emit("newMessageReceived", {
        data: {...data,messageId:crypto.randomBytes(5).toString("hex")}

      });
    }
  });
});
