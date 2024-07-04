import React, { useEffect, useRef, useState } from 'react'
import { Editor, TLShape, Tldraw } from 'tldraw'
import CustomToolbar from '@/components/toolbar/CustomToolbar'
import { socket } from '@/socket'
import { Player, Room } from '@prisma/client'
import useUserCheck from '@/hooks/useUserCheck'

const SketchBoard = ({room}: {room: Room}) => {
  const editorRef = useRef<Editor | null>(null)
  const { player } = useUserCheck()
  const handleShapeChange = () => {
    const editor = editorRef.current

    if (editor &&  player?.id === room.currentPlayerId) {
      const shapes = editor.getCurrentPageShapes()
      socket.emit('drawing', {shapes, roomId: room.id, player: player?.name})
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

  const clearAll = (player: Player) => {
    const editor = editorRef.current
    if (editor) {
      editor.deleteShapes(editor.getCurrentPageShapes())
    }
  }

  const removeShapes = () => {
    if(player?.id === room.currentPlayerId) socket.emit('remove-all', {roomId: room.id, player: player?.name})
  }

  useEffect(() => {
    socket.on('receive-drawing', receiveDrawing)
    socket.on('clear', clearAll)
    socket.emit('join-room', room.id)

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
          hideUi={player?.id !== room.currentPlayerId}
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
            // editor.updateInstanceState({ isReadonly: !(player?.id === room.currentPlayerId) })
            editor.addListener('change', handleShapeChange)
          }}
        />
      </div>
    </>
  )
}
export default SketchBoard
