import { Server, Socket} from 'socket.io';
import { updatePlayerTurn, deletePlayer } from '../services/apiService';
import { calculateScore } from '../services/calculationService';

type RoomState = {
  wordToDraw: string,
  startsAt: Date | null,
  totalPlayers: number,
  currentGuessedPlayers: string[]
}

const roomsState: {[key: string]: RoomState}  = {}

export const handleConnection = (socket: Socket, io: Server) => {
  socket.on('create-room', (roomId) => {
    roomsState[roomId] = {wordToDraw: "", startsAt: null, totalPlayers: 0, currentGuessedPlayers: []}
  })

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("new-player-joined", socket.id)
  })

  socket.on("start-game", ({wordToDraw, roomId, playerName, totalPlayers}) => {
    roomsState[roomId] = {
      ...roomsState[roomId],
      wordToDraw, 
      totalPlayers,
      startsAt: new Date()
    }

    socket.to(roomId).emit("game-started", {wordCount: wordToDraw.length, playerName});
  })

  socket.on("drawing", ({shapes, roomId, player}) => {
    socket.to(roomId).emit("receive-drawing", { shapes, player });
  })

  socket.on("remove-all", ({roomId, player}) => {
    socket.to(roomId).emit("clear", player);
  })

  socket.on('send-message', ({input, roomId, player, currentTurnPlayerId}) => {
    const {wordToDraw, startsAt, totalPlayers, currentGuessedPlayers} = roomsState[roomId]
    const isWordGuessed = wordToDraw.toLowerCase() === input.toLowerCase()
    
    if(isWordGuessed) {
      roomsState[roomId].currentGuessedPlayers.push(player.id)
      calculateScore({startsAt, totalPlayers, currentGuessedPlayers, player, currentTurnPlayerId, roomId})

      io.to(roomId).emit('word-guessed', {player, isWordGuessed})
    }
    socket.to(roomId).emit('receive-message', {input, roomId, player, isWordGuessed});
  })

  socket.on('leave-room', async ({roomId, player}) => {
    await deletePlayer(player.id)
    socket.to(roomId).emit('player-left', player)
  })

  socket.on('time-left', ({roomId, timeLeft}) => {
    socket.to(roomId).emit('remaining-time', timeLeft)
  })

  socket.on('time-up', async ({roomId}: { roomId: string}) => {
    try {
      const response = await updatePlayerTurn(roomId)
      setTimeout(() => {
        io.to(roomId).emit('new-player-turn', response.data.currentPlayer);
      }, 5000);
    } catch (error) {
      console.log(error)
    } finally {
      io.to(roomId).emit('timeout', roomsState[roomId].wordToDraw)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
}
