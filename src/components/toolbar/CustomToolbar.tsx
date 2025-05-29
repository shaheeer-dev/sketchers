import React from 'react'
import { DefaultToolbar, TldrawUiMenuItem, useEditor, useTools } from 'tldraw'

const CustomToolbar = ({ onClick }: { onClick: () => void }) => {
  const editor = useEditor()
  const tools = useTools()
  return (
    <div>
      <DefaultToolbar>
        <TldrawUiMenuItem {...tools['draw']}/>
        <button
          onClick={() => {
            editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
            onClick()
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
