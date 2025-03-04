"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DrawingCanvas from "./DrawingCanvas";
import { getRandomPrompt } from "@/lib/prompt";
import PromptDisplay from "./PromptDisplay";
import ResultDisplay from "./ResultDisplay";


type GameState = "waiting" | "drawing" | "analyzing" | "result";

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [drawingData, setDrawingData] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<{
    correct: boolean;
    guess: string;
    confidence: number;
  } | null>(null);

  const startGame = () => {
    setCurrentPrompt(getRandomPrompt());
    setGameState("drawing");
    setDrawingData(null);
    setAiResponse(null);
  };

  const handleDrawingComplete = (imageData: string) => {
    setDrawingData(imageData);
    setGameState("analyzing");
    analyzeDrawing(imageData);
  };

  const analyzeDrawing = async (imageData: string) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
          prompt: currentPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze drawing");
      }

      const result = await response.json();
      setAiResponse(result);
      setGameState("result");
    } catch (error) {
      console.error("Error analyzing drawing:", error);
      setGameState("result");
      setAiResponse({
        correct: false,
        guess: "Error analyzing drawing",
        confidence: 0,
      });
    }
  };

  const playAgain = () => {
    setGameState("waiting");
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6">
        {gameState === "waiting" && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Ready to play?</h2>
            <p className="text-center text-muted-foreground mb-4">
              I'll give you something to draw, then I'll try to guess what it is!
            </p>
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </div>
        )}

        {gameState === "drawing" && (
          <div className="flex flex-col gap-4">
            <PromptDisplay prompt={currentPrompt} />
            <DrawingCanvas onComplete={handleDrawingComplete} />
          </div>
        )}

        {gameState === "analyzing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p>Analyzing your masterpiece...</p>
          </div>
        )}

        {gameState === "result" && aiResponse && (
          <div className="flex flex-col gap-4">
            <ResultDisplay
              correct={aiResponse.correct}
              guess={aiResponse.guess}
              confidence={aiResponse.confidence}
              prompt={currentPrompt}
              drawingImage={drawingData}
            />
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={playAgain}>Play Again</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}