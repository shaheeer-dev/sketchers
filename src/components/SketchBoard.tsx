'use client'
import React from 'react'
import { DefaultToolbar, Tldraw, TldrawUiMenuItem, useEditor, useTools } from 'tldraw'

const SketchBoard = () => {


  return (
    <>
      <div className="fixed inset-0 m-auto w-1/2 h-1/2">
        <Tldraw
        forceMobile
        components={{
          PageMenu: null,
          MainMenu: null,
          DebugMenu: null,
          ActionsMenu: null,
          MenuPanel: null, 
          QuickActions: null,
          Toolbar: CustomToolbar,
        }
        }
        cameraOptions={{isLocked: true}}
        />
      </div>
    </>
  )
}
export default SketchBoard


function CustomToolbar() {
	const editor = useEditor()
	const tools = useTools()
  console.log(tools)
	return (
		<div>
			<DefaultToolbar>
        <TldrawUiMenuItem {...tools['draw']}  />
        <TldrawUiMenuItem {...tools['eraser']} />
				<button
					onClick={() => {
						editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
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
