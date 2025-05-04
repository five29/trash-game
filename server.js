const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Serve game.html at root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/game.html');
});

let players = {};

io.on('connection', (socket) => {
  console.log('✅ Player connected:', socket.id);

  socket.on('join', (data) => {
    players[socket.id] = {
      name: data,
      x: 0.5,
      y: 0.5,
      score: 0
    };
    console.log(`🎮 Player joined: ${data}`);
    io.emit('playerJoined', { id: socket.id, name: data });
  });

  socket.on('playerMove', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      io.emit('updateGame', { id: socket.id, move: data });
    }
  });

  socket.on('tryCollectTrash', () => {
    if (players[socket.id]) {
      players[socket.id].score += 1;
      console.log(`✨ +1 for ${players[socket.id].name}: ${players[socket.id].score}`);
      io.emit('scoreUpdate', { id: socket.id, score: players[socket.id].score });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id);
    delete players[socket.id];
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
