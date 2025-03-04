
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DrawingCanvas from './DrawingCanvas';
import { toast } from 'sonner';

const DRAWING_PROMPTS = [
  'cat', 'dog', 'house', 'tree', 'car', 'flower', 'sun', 'moon', 
  'bicycle', 'airplane', 'apple', 'banana', 'chair', 'phone',
  'book', 'cup', 'clock', 'star', 'heart', 'fish'
];

type GameState = 'idle' | 'drawing' | 'processing' | 'result';

export default function DrawingGame() {
  
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [aiGuess, setAiGuess] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * DRAWING_PROMPTS.length);
    return DRAWING_PROMPTS[randomIndex];
  };
  
  const startGame = () => {
    setCurrentPrompt(getRandomPrompt());
    setGameState('drawing');
    setAiGuess('');
    setIsCorrect(false);
  };
  
  const handleSubmit = async (imageData: string) => {
    try {
      setGameState('processing');
      
      const response = await fetch('/api/analyze-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          prompt: currentPrompt,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze drawing');
      }
      
      const data = await response.json();
      setAiGuess(data.guess);
      setIsCorrect(data.isCorrect);
      setGameState('result');
      
    } catch (error) {
      console.error('Error analyzing drawing:', error);
      toast('Failed to analyze your drawing. Please try again.',
      );
      setGameState('drawing');
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Drawing Challenge</CardTitle>
        <CardDescription>
          {gameState === 'idle' && 'Start a new game to get a prompt and draw it!'}
          {gameState === 'drawing' && `Draw a ${currentPrompt}`}
          {gameState === 'processing' && 'Analyzing your drawing...'}
          {gameState === 'result' && 'See if the AI guessed correctly!'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(gameState === 'idle' || gameState === 'result') ? (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg min-h-[300px]">
            {gameState === 'idle' ? (
              <p className="text-center text-muted-foreground">Click "Start Game" to begin!</p>
            ) : (
              <div className="space-y-4 text-center">
                {isCorrect ? (
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">Correct!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      The AI correctly identified your drawing of a "{currentPrompt}" as "{aiGuess}".
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <AlertTitle className="text-amber-800">Not quite!</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      The AI thought your drawing of a "{currentPrompt}" was a "{aiGuess}".
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        ) : (
          <DrawingCanvas onSubmit={handleSubmit} isProcessing={gameState === 'processing'} />
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {gameState === 'idle' || gameState === 'result' ? (
          <Button onClick={startGame} size="lg">
            {gameState === 'idle' ? 'Start Game' : 'Play Again'}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={startGame} 
            disabled={gameState === 'processing'}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> New Prompt
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}