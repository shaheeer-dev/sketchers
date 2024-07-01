import React, { useEffect, useRef, useState } from 'react'
import { Editor, TLShape, Tldraw } from 'tldraw'
import CustomToolbar from '../toolbar/CustomToolbar'
import { socket } from '@/socket'
import { useParams } from 'next/navigation'

const SketchBoard = () => {
  const editorRef = useRef<Editor | null>(null);
  const { roomId }: { roomId: string } = useParams();
  // const [userName, setUserName] = useState<string>('');
  const handleShapeChange = () => {
    const editor = editorRef.current;
    if (editor) {
      const shapes = editor.getCurrentPageShapes();
      socket.emit('drawing', {shapes, roomId});
      console.log("emitting")
    }
  };

  const drawShapes = (shapes: any) => {
    const editor = editorRef.current;
    if (editor) {
      console.log('drawShapes', shapes)
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
    socket.emit('join-room', roomId)

    // Cleanup on unmount
    return () => {
      socket.off('receive-drawing', receiveDrawing);
      socket.off('clear', clearAll)
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 w-1/2 h-1/2 mx-auto">
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
          editorRef.current = editor;
          editor.addListener('change', handleShapeChange);
        }}
        />
      </div>
    </>
  )
}
export default SketchBoard
