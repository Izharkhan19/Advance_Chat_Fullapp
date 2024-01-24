// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const colors = require("colors");
// const userRoutes = require("./Routes/userRoutes");
// const chatRoutes = require("./Routes/chatRoutes");

// const connentDB = require("./config/dbConfig");
// const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
// const app = express();

// // Middlewares Starts7
// app.use(cors());
// app.use(express.json());
// dotenv.config();

// // DB Connection Starts
// connentDB();

// // basic Starts
// app.get("/", (req, res) => {
//   res.send("My api is running Successfully.");
// });

// // Routes Starts
// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);

// app.use(notFound);
// app.use(errorHandler);

// // Server Starts
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`Server starts on ${PORT}`.yellow.bold));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const connectDB = require("./config/dbConfig"); // Fix typo here
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
const app = express();

// Middlewares Start
app.use(cors());
app.use(express.json());
dotenv.config();

// DB Connection Start
connectDB(); // Fix typo here

// Basic Start
app.get("/", (req, res) => {
  res.send("My API is running Successfully.");
});

// Routes Start
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server starts on ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User join room", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) {
      return console.log("Chat.users is not defined");
    }
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User dis-connected.");
    socket.leave(userData._id);
  });
  
});
