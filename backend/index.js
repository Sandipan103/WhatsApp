
// required dependency
const express = require("express");
const app = express();
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const pasth = require('path')

require("dotenv").config();
// required env string
const PORT = process.env.PORT;

// // connect with db
const dbConnect = require("./config/database");
// dbConnect();
// //
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// Connect to MongoDB by calling the imported connectDB function
dbConnect()
  .then(() => {
    // Start your server once the MongoDB connection is established
    const port = process.env.PORT || 3000;

    // Create the HTTP server
    const server = http.createServer(app);

    const _dirname = path.dirname("")
    const buildPath = path.join(_dirname  , "../frontend/build");
    
    app.use(express.static(buildPath))
    
    app.get("/*", function(req, res){
    
        res.sendFile(
            path.join(__dirname, "../frontend/build/index.html"),
            function (err) {
              if (err) {
                res.status(500).send(err);
              }
            }
          );
    
    })

    console.log("connected");
    // Attach Socket.io to the HTTP server
    const io = require("socket.io")(server, {
      cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const userConnections = new Map();

    io.on('connection', (socket) => {
      
      const userId = socket.handshake.query.userId; // Extract user ID from query parameters
      userConnections.set(userId, socket);
    
      socket.on('private-message', ({ to, message }) => {
        const toSocket = userConnections.get(to);
        if (toSocket) {
          toSocket.emit('private-message', { from: userId, message });
        }
      });
    
      socket.on('disconnect', () => {
        userConnections.delete(userId);
      });
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start the server:", error);
  });

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

// routing
const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")
const chatRoutes = require("./routes/chatRoutes");
const path = require("path");


app.use("/api/v1", authRoutes)
app.use("/api/v1", profileRoutes)
app.use("/api/v1", chatRoutes)



