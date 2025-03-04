// Collection of drawing prompts for the game
const DRAWING_PROMPTS = [
    "Cat",
    "Dog",
    "House",
    "Tree",
    "Car",
    "Bicycle",
    "Sun",
    "Moon",
    "Star",
    "Flower",
    "Mountain",
    "Ocean",
    "Fish",
    "Bird",
    "Airplane",
    "Robot",
    "Pizza",
    "Ice cream",
    "Book",
    "Clock",
    "Chair",
    "Table",
    "Laptop",
    "Phone",
    "Hat",
    "Glasses",
    "Umbrella",
    "Cloud",
    "Lightning",
    "Rainbow",
  ];
  
  /**
   * Returns a random drawing prompt from the list
   */
  export function getRandomPrompt(): string {
    const randomIndex = Math.floor(Math.random() * DRAWING_PROMPTS.length);
    return DRAWING_PROMPTS[randomIndex];
  }