const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Track connected users
let users = [];

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create a new anonymous user with random name and color
    const user = {
        id: socket.id,
        name: `Anonymous ${Math.floor(Math.random() * 10000)}`,
        color: getRandomColor(),
    };

    users.push(user);

    // Send user data to the connected client
    socket.emit('user-data', user);

    // Send user list to all clients
    io.emit('user-list', users);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove disconnected user from the list
        users = users.filter(u => u.id !== socket.id);
        // Update user list for remaining clients
        io.emit('user-list', users);
    });

    socket.on('chat-message', (message) => {
        // Broadcast the message to all clients
        io.emit('chat-message', {
            user,
            message,
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    } while (color === '#000000'); // Avoid black color
    return color;
}