import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import axios from 'axios';

const app = next({ dev:  process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();
const roomsState = {}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  const io = new Server(server);

  io.on('connection', socket => {
    // Emit events to all connected clients
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("new-player-joined", socket.id)
    })

    socket.on("start-game", ({wordToDraw, roomId, playerName}) => {
      roomsState[roomId] = wordToDraw
      socket.to(roomId).emit("game-started", {wordCount: wordToDraw.length, playerName});
    })

    socket.on("drawing", ({shapes, roomId, player}) => {
      socket.to(roomId).emit("receive-drawing", { shapes, player });
    })

    socket.on("remove-all", ({roomId, player}) => {
      socket.to(roomId).emit("clear", player);
    })

    socket.on('send-message', ({input, roomId, player}) => {
      const isWordGuessed = roomsState[roomId] === input

      if(isWordGuessed) io.to(roomId).emit('word-guessed', {player, isWordGuessed})
      socket.to(roomId).emit('receive-message', {input, roomId, player, isWordGuessed});
    })

    socket.on('leave-room', async ({roomId, player}) => {
      await axios.delete(`http://localhost:3000/api/players/${player.id}`)
      socket.to(roomId).emit('player-left', player)
    }) 

    socket.on('time-left', ({roomId, timeLeft}) => {
      socket.to(roomId).emit('remaining-time', timeLeft)
    })

    socket.on('time-up', async ({roomId, currentPlayerId}) => {
      try {
        const response = await axios.put(`http://localhost:3000/api/rooms/${roomId}/updatePlayerTurn`)
        setTimeout(() => {
          io.to(roomId).emit('new-player-turn', response.data.currentPlayer);
        }, 5000);
      } catch (error) {
        console.log(error)
      } finally {
        io.to(roomId).emit('timeout', roomsState[roomId])
      }
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});