import { Player } from '@prisma/client'
import { io } from "../websocket-server";

const GUESSING_MULTIPLIER = 10
const DRAWING_BASE_MULTIPLIER = 2

type CalculateScoreParams = {
  startsAt: Date | null,
  totalPlayers: number,
  currentGuessedPlayers: string[],
  player: Player,
  currentTurnPlayerId: number,
  roomId: string,
}
export const calculateScore  = ({
  startsAt, totalPlayers, currentGuessedPlayers, player, currentTurnPlayerId, roomId
}: CalculateScoreParams) => {
  //  Move this code to the backend
  // make an API that calculates the score and saves it in the DB for the player
  // When the Times Up than make another API call in the BE to get the players score.
  
  const difference = Number(new Date()) - Number(startsAt)
  const remainingTime = Math.floor(difference / 1000)
  const guessingScore =  GUESSING_MULTIPLIER * remainingTime
  const guesserScore  = Math.floor(guessingScore)

  const factor             = currentGuessedPlayers.length / totalPlayers
  const drawingScore       = remainingTime * factor * DRAWING_BASE_MULTIPLIER
  const drawerScore        = Math.floor(drawingScore)

  io.to(roomId).emit('scores',  {[currentTurnPlayerId]: drawerScore, [player.id]: guesserScore})
}