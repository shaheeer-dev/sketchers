import React from 'react'
import { DefaultToolbar, TldrawUiMenuItem, useEditor, useTools } from 'tldraw'
import { socket } from '@/socket'

const CustomToolbar = (roomId: String) => {
  const editor = useEditor()
	const tools = useTools()
  return (
    <div>
    <DefaultToolbar>
      <TldrawUiMenuItem {...tools['draw']}/>
      <button
        onClick={() => {
          editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
          socket.emit("remove-all", roomId)
        }}
        title="delete all"
        className='w-9 h-10 text-red-500'
      >
        🧨
      </button>
    </DefaultToolbar>
  </div>
  )
}

export default CustomToolbar