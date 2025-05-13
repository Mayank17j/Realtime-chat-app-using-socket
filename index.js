// npm init -y
// npm install bcrypt cors dotenv express jsonwebtoken mongoose express socket.io
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const http = require("http");
const { Server } = require("socket.io");
const Messages = require("./models/Messages");
const User = require("./models/User");

// .env
// routes
// models
dotenv.config();
const app = express();

// creating server to run app & operate socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb connected."))
  .catch((error) => console.error(error));

app.use("/auth", authRoutes);

// socket io logic
// listen new client connection to the server with unique id
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // event trigger when client send message "send_message"
  // socket will listen for send message event, from client side
  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;
    const newMessage = new Messages({ sender, receiver, message });
    await newMessage.save();

    // Reciever side: Notify receiver for the new message
    socket.broadcast.emit("receive_message", data);
  });

  // when client disconnect the server
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// for the front end
// get request for the users
// get request for the message
app.get("/messages", async (req, res) => {
  const { sender, receiver } = req.query;
  try {
    // fetch message from DB
    const messages = await Messages.find({
      // or query the fetch message send by sender or recevier
      $or: [
        { sender, receiver }, // sender to receiver
        { sender: receiver, receiver: sender }, //receiver to sender
      ],
    }).sort({ createdAt: 1 }); // sort by latest first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ messages: "Error fetching messages" });
  }
});

// get request for the users
app.get("/users", async (req, res) => {
  const { currentUser } = req.query;
  try {
    // fetch all user except current user
    const users = await User.find({ username: { $ne: currentUser } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ messages: "Error fetching users" });
  }
});

server.listen(PORT, () => console.log(`Server running on port:${PORT}`));
