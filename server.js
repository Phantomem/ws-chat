const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { generateUsername } = require("unique-username-generator");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    const userName = generateUsername('', 0, 15);
    io.emit('user-connection', JSON.stringify({message: 'A user has connected', userName}));

    socket.on('chat-message', (msg) => {
        io.emit('chat-message', JSON.stringify({message: msg, userName}));
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnection', JSON.stringify({message: 'A user has disconnected', userName}));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});