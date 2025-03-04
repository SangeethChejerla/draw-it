
'use client';

import { useRef } from 'react';
import { Tldraw, TldrawEditor, createTLStore, defaultTools } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { Button } from '@/components/ui/button';
import { Loader2, Undo2, Eraser, Send } from 'lucide-react';

interface DrawingCanvasProps {
  onSubmit: (imageData: string) => void;
  isProcessing: boolean;
}

export default function DrawingCanvas({ onSubmit, isProcessing }: DrawingCanvasProps) {
  const editorRef = useRef<TldrawEditor | null>(null);
  
  const extractImageData = async () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    
    const blob = await editor.exportImage('png', { 
      scale: 2, 
      background: true,
      padding: 16
    });
    
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };
  
  const handleSubmit = async () => {
    if (!editorRef.current) return;
    
    const imageData = await extractImageData();
    if (imageData) {
      onSubmit(imageData);
    }
  };
  
  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.undo();
    }
  };
  
  const handleEraser = () => {
    if (editorRef.current) {
      editorRef.current.setCurrentTool('eraser');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
        <Tldraw
          store={createTLStore()}
          tools={defaultTools}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          hideUi
        />
      </div>
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={handleUndo} disabled={isProcessing}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleEraser} disabled={isProcessing}>
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={isProcessing} className="flex items-center gap-2">
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Drawing
            </>
          )}
        </Button>
      </div>
    </div>
  );
}