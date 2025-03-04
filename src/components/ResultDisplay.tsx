import { Card, CardContent } from "@/components/ui/card";

interface ResultDisplayProps {
  correct: boolean;
  guess: string;
  confidence: number;
  prompt: string;
  drawingImage: string | null;
}

export default function ResultDisplay({
  correct,
  guess,
  confidence,
  prompt,
  drawingImage,
}: ResultDisplayProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-center">
        {correct ? "I got it right! 🎉" : "Hmm, I'm not sure... 🤔"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-muted-foreground mb-2">You were asked to draw:</h4>
            <p className="text-xl font-semibold">{prompt}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-muted-foreground mb-2">I think it's:</h4>
            <p className="text-xl font-semibold">{guess}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {drawingImage && (
        <div className="mt-4">
          <h4 className="font-medium text-muted-foreground mb-2">Your drawing:</h4>
          <div className="border rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={drawingImage} 
              alt="Your drawing" 
              className="w-full object-contain bg-white" 
            />
          </div>
        </div>
      )}
    </div>
  );
}