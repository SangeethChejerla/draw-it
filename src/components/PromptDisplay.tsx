import { Card, CardContent } from "@/components/ui/card";

interface PromptDisplayProps {
  prompt: string;
}

export default function PromptDisplay({ prompt }: PromptDisplayProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Draw this:</h3>
        <p className="text-2xl font-bold text-center py-2">{prompt}</p>
      </CardContent>
    </Card>
  );
}