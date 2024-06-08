const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data
app.use(express.urlencoded({extended:true})) //to accept nested json

//routes for controllers
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  5000,
  console.log(`Server running on PORT ${5000}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    if(!onlineUsers.some((user) => user._id == userData._id)){
      onlineUsers.push({ userId: userData._id, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
    }
    socket.join(userData._id);
    socket.emit("connected",onlineUsers);
  });

  socket.on("offline", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("user is offline", onlineUsers);
    io.emit("get-users", onlineUsers);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("user is offline", onlineUsers);
    io.emit("get-users", onlineUsers);
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
