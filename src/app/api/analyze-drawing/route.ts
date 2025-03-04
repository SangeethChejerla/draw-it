import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { imageData, prompt } = await request.json();
    
    if (!imageData || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Create the prompt parts
    const promptParts = [
      { text: `What object is drawn in this image? Please respond with a single word. The person was asked to draw a "${prompt}".` },
      {
        inlineData: {
          mimeType: 'image/png',
          data: imageData.split(',')[1] // Remove the data URL prefix
        }
      }
    ];
    
    // Generate content
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: promptParts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 50,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    
    const responseText = result.response.text().toLowerCase();
    
    // Process the response to extract the guess
    let guess = '';
    
    // Try to extract a single word as the guess
    const words = responseText.split(/\s+/).filter(word => 
      word.length > 1 && 
      !['a', 'an', 'the', 'is', 'was', 'that', 'this', 'it', 'looks', 'like', 'seems'].includes(word.toLowerCase())
    );
    
    if (words.length > 0) {
      // Clean up any punctuation
      guess = words[0].replace(/[^\w]/g, '');
    } else {
      guess = "unknown";
    }
    
    // Check if the guess matches the prompt
    const normalizedPrompt = prompt.toLowerCase().trim();
    const normalizedGuess = guess.toLowerCase().trim();
    
    // Consider it correct if either contains the other
    const isCorrect = 
      normalizedPrompt.includes(normalizedGuess) || 
      normalizedGuess.includes(normalizedPrompt);
    
    return NextResponse.json({ guess, isCorrect });
    
  } catch (error) {
    console.error('Error analyzing drawing:', error);
    return NextResponse.json(
      { error: 'Failed to analyze drawing' },
      { status: 500 }
    );
  }
}