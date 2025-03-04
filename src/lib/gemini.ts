import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeDrawing(imageData: string, promptText: string) {
  try {
    // Remove the data URL prefix
    const base64Image = imageData.split(",")[1];
    
    // Get the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create the content parts for the model
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/png",
      },
    };
    
    // Create the prompt for the model
    const prompt = `I'm showing you a drawing. The user was asked to draw "${promptText}". 
    First, identify what the drawing depicts. Then, determine if it matches the prompt "${promptText}".
    Return only a JSON object with the following format:
    {
      "guess": "what you think the drawing shows",
      "correct": true or false based on if it matches the prompt,
      "confidence": a number between 0.0 and 1.0 representing how confident you are in your guess
    }`;
    
    // Generate content from the model
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's surrounding text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const jsonResponse = JSON.parse(jsonMatch[0]);
      return {
        guess: jsonResponse.guess || "Unknown",
        correct: jsonResponse.correct || false,
        confidence: jsonResponse.confidence || 0,
      };
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      return {
        guess: "Error analyzing drawing",
        correct: false,
        confidence: 0,
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}