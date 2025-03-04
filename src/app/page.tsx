import DrawingGame from '@/components/DrawingGame';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">AI Drawing Guessing Game</h1>
      <DrawingGame />
    </main>
  );
}