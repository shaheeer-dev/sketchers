import axios from "axios";

export const updatePlayerTurn = async (roomId: string) => {
  return axios.put(`http://localhost:3000/api/rooms/${roomId}/updatePlayerTurn`)
}

export const deletePlayer = async (playerId: number) => {
  return axios.delete(`http://localhost:3000/api/players/${playerId}`)
}
