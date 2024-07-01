import axios from 'axios'
import React from 'react'

const PlayerForm = ({roomId, setPlayer}: any) => {

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()
    const name = e.target.name.value
    const response = await axios.post('/api/players', { name, roomId })
    localStorage.setItem('player', response.data.player)
    setPlayer(true)
  }
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
        <button type="submit">Join</button>
      </form>
    </>
  )
}

export default PlayerForm
