import React, { useEffect, useRef, useState } from 'react'
import { Editor, TLShape, Tldraw } from 'tldraw'
import CustomToolbar from '../toolbar/CustomToolbar'
import { socket } from '@/socket'
import { useParams } from 'next/navigation'
import { Resizable } from 're-resizable';

const SketchBoard = () => {
  const editorRef = useRef<Editor | null>(null);
  const { roomId }: { roomId: string } = useParams();
  // const playerName = localStorage.getItem('player')
  const [playerName, setPlayerName] = useState<string>(() => localStorage.getItem('playerName') || '');
  const handleShapeChange = () => {
    const editor = editorRef.current;
    //  TODO - get player name whose current turn
    if (editor &&  playerName === 'Shaheer') {
      const shapes = editor.getCurrentPageShapes();
      socket.emit('drawing', {shapes, roomId, player: playerName});
    }
  }

  const drawShapes = (data: any) => {
    const editor = editorRef.current;
    if (editor) {
      editor.createShapes(data.shapes);
    }
  }

  const receiveDrawing = (data: { shapes: TLShape[], player: string }) => {
    drawShapes(data);
  }

  const clearAll = () => {
    const editor = editorRef.current
    if (editor) {
      editor.deleteShapes(editor.getCurrentPageShapes())
    }
  }


  useEffect(() => {
    socket.on('receive-drawing', receiveDrawing)
    socket.on('clear', clearAll)
    socket.emit('join-room', roomId)

    // Cleanup on unmount
    return () => {
      socket.off('receive-drawing', receiveDrawing)
      socket.off('clear', clearAll)
    }
  }, [])

  return (
    <>
      <div className="h-[90%] mx-auto">
        <Tldraw
          forceMobile
          components={{
            PageMenu: null,
            MainMenu: null,
            DebugMenu: null,
            ActionsMenu: null,
            MenuPanel: null, 
            QuickActions: null,
            Toolbar: () => CustomToolbar(roomId),
          }
          }
          cameraOptions={{isLocked: true}}
          onMount={(editor) => { 
            editorRef.current = editor
            editor.addListener('change', handleShapeChange)
          }}
        />
      </div>
    </>
  )
}
export default SketchBoard
