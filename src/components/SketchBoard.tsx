'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Editor, TLShape, Tldraw } from 'tldraw'
import CustomToolbar from './toolbar/CustomToolbar'
import { socket } from '@/socket'

const SketchBoard = () => {
  const editorRef = useRef<Editor | null>(null);
  const [userName, setUserName] = useState<string>('');
  const handleShapeChange = () => {
    const editor = editorRef.current;
    if (editor && userName === 'Shaheer') {
      const shapes = editor.getCurrentPageShapes();
      socket.emit('drawing', shapes);
      console.log("emitting")
    }
  };


  const drawShapes = (shapes: any) => {
    const editor = editorRef.current;
    if (editor) {
      editor.createShapes(shapes);
    }
  };

  const receiveDrawing = (shapes: TLShape[]) => {
    console.log("receiving",shapes)
    drawShapes(shapes);
  }

  const clearAll = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.deleteShapes(editor.getCurrentPageShapes());
    }
  }


  useEffect(() => {
    socket.on('receive-drawing', receiveDrawing);
    socket.on("clear", clearAll)

    // Cleanup on unmount
    return () => {
      socket.off('receive-drawing', receiveDrawing);
      socket.off('clear', clearAll)
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0">
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
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
        onMount={(editor) => { 
          editorRef.current = editor;
          editor.addListener('change', handleShapeChange);
        }}
        />
      </div>
    </>
  )
}
export default SketchBoard
