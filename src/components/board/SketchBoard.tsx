import React, { useEffect, useRef } from 'react'
import { Editor, TLShape, Tldraw } from 'tldraw'
import CustomToolbar from '@/components/toolbar/CustomToolbar'
import { socket } from '@/socket'
import { Player, Room } from '@prisma/client'
import useUserCheck from '@/hooks/useUserCheck'

const SketchBoard = ({roomId, isStarted, currentTurnPlayerId}: {roomId: string, isStarted: boolean, currentTurnPlayerId: number}) => {
  const editorRef = useRef<Editor | null>(null)
  const { player } = useUserCheck()
  const handleShapeChange = () => {
    const editor = editorRef.current

    if (editor &&  player?.id === currentTurnPlayerId) {
      const shapes = editor.getCurrentPageShapes()
      socket.emit('drawing', {shapes, roomId, player: player?.name})
    }
  }

  const drawShapes = (data: { shapes: TLShape[], player: string }) => {
    const editor = editorRef.current
    if (editor) {
      editor.createShapes(data.shapes)
    }
  }

  const receiveDrawing = (data: { shapes: TLShape[], player: string }) => {
    drawShapes(data)
  }

  const clearAll = () => {
    const editor = editorRef.current
    if (editor) {
      editor.deleteShapes(editor.getCurrentPageShapes())
    }
  }

  const removeShapes = () => {
    if(player?.id === currentTurnPlayerId) socket.emit('remove-all', {roomId, player: player?.name})
  }

  useEffect(() => {
    socket.on('receive-drawing', receiveDrawing)
    socket.on('clear', clearAll)
    socket.emit('join-room', roomId)

    // Cleanup on unmount
    return () => {
      socket.off('receive-drawing', receiveDrawing)
      socket.off('clear', clearAll)
      clearAll();

    }
  }, [])

  useEffect(() => {
    clearAll();
  }, [isStarted])

  return (
    <>
      <div className="h-[90%] mx-auto">
        <Tldraw
          forceMobile
          hideUi={player.id !== currentTurnPlayerId || !isStarted}
          components={{
            PageMenu: null,
            MainMenu: null,
            DebugMenu: null,
            ActionsMenu: null,
            MenuPanel: null, 
            QuickActions: null,
            Toolbar: () => <CustomToolbar onClick={() => removeShapes()} />
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
