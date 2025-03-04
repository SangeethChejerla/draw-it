"use client";

import { useState } from "react";
import { Tldraw, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { Button } from "@/components/ui/button";

interface DrawingCanvasProps {
  onComplete: (imageData: string) => void;
}

export default function DrawingCanvas({ onComplete }: DrawingCanvasProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-[400px] border rounded-md overflow-hidden">
        <Tldraw persistenceKey="ai-drawing-game">
          <SubmitButton onComplete={onComplete} />
        </Tldraw>
      </div>
    </div>
  );
}

function SubmitButton({ onComplete }: DrawingCanvasProps) {
  const [isExporting, setIsExporting] = useState(false);
  const editor = useEditor();

  const handleSubmit = async () => {
    if (!editor) return;
    
    try {
      setIsExporting(true);
      
      // Export the current drawing as an SVG
      const svg = await editor.getSvg(Array.from(editor.getCurrentPageShapes().map(shape => shape.id)));
      
      if (!svg) {
        throw new Error("Could not export drawing");
      }
      
      // Convert SVG to a data URL
      const svgString = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      
      // Convert to PNG using canvas
      const img = new Image();
      const dataUrl = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          setIsExporting(false);
          return;
        }
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const imageData = canvas.toDataURL("image/png");
        onComplete(imageData);
        URL.revokeObjectURL(dataUrl);
        setIsExporting(false);
      };
      
      img.src = dataUrl;
    } catch (error) {
      console.error("Error exporting drawing:", error);
      setIsExporting(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button 
        onClick={handleSubmit} 
        disabled={isExporting}
        size="sm"
      >
        {isExporting ? "Processing..." : "Submit Drawing"}
      </Button>
    </div>
  );
}