require('dotenv').config();
const path = require("path");
const app = require("./app");
const connectDB = require('./db/index');
const http = require("http");
const { Server } = require("socket.io");
const axios = require('axios');

const port = process.env.PORT || 3000;
const url = process.env.SERVER_URL;

// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, // e.g. "http://localhost:5173"
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send("Never Ever GiveUp!");
});

// Prevent sleep
setInterval(() => {
    axios.get(url)
        .then(() => console.log('Stay awake'))
        .catch(err => console.error('Going down!', err));
}, 14 * 60 * 1000);

// Attach socket io
app.set("io", io);

io.on("connection", (socket) => {
    console.log("Socket connected:", io.engine.clientsCount);

    socket.on("join_donation", (donationId) => {
        socket.join(donationId);
        console.log(`User joined room: ${donationId}`);
    });
});

// DB Connect then start server
connectDB().then(() => {
    server.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });
})