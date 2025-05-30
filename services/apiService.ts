import axios from "axios";

const baseURL = "http://localhost:3000/api"

export const updatePlayerTurn = async (roomId: string) => {
  return axios.put(`${baseURL}/rooms/${roomId}/updatePlayerTurn`)
}

export const deletePlayer = async (playerId: number) => {
  return axios.delete(`${baseURL}/players/${playerId}`)
}

export const getRoomById = async (roomId: string) => {
  return axios.get(`${baseURL}/rooms/${roomId}`)
}
