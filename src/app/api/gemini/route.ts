import { NextRequest, NextResponse } from "next/server";
import { analyzeDrawing } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    const result = await analyzeDrawing(image, prompt);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to analyze drawing" },
      { status: 500 }
    );
  }
}