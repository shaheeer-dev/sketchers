import axios from 'axios';
import React from 'react';

const PlayerForm = ({ roomId, setPlayer }: { roomId: string, setPlayer: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [playerName, setPlayerName] = React.useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = playerName;
    const response = await axios.post('/api/players', { name, roomId });
    localStorage.setItem('player', JSON.stringify(response.data.player));
    localStorage.setItem('playerName', response.data.player.name);
    setPlayer(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-[50%]">
        <label htmlFor="name" className="mb-2 text-lg font-medium text-gray-800">Player Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={playerName}
          onChange={handleNameChange}
          className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          className="px-6 py-3 text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default PlayerForm;
