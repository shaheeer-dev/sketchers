import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import JoinRoom from './JoinRoom';

const CreateRoom = () => {
  const router = useRouter()

  const createRoom = async () => {
    const response = await axios.post('/api/rooms');
    const roomId = response.data.roomId;
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
      <button
        onClick={createRoom}
        className="px-6 py-3 mb-4 text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700"
      >
        Create Room
      </button>
      <p className='text-white py-4'>OR</p>
      <JoinRoom />
    </div>
  );
};

export default CreateRoom;
