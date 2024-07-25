const drawableWords = [
  "Apple", "Tree", "Sun", "Car", "Dog", "Cat", "House", "Bird", "Fish", "Flower",
  "Star", "Moon", "Boat", "Book", "Chair", "Table", "Cup", "Ball", "Hat", "Shoe",
  "Plane", "Train", "Bus", "Bicycle", "Clock", "Key", "Door", "Window", "Bridge", "Mountain",
  "River", "Ocean", "Beach", "Cloud", "Rain", "Snow", "Treehouse", "Castle", "Knight", "Dragon",
  "Princess", "Dinosaur", "Robot", "Alien", "Spaceship", "Rocket", "Planet", "Starfish", "Crab", "Turtle",
  "Elephant", "Lion", "Tiger", "Bear", "Monkey", "Giraffe", "Zebra", "Kangaroo", "Butterfly", "Bee",
  "Ladybug", "Ant", "Spider", "Snake", "Frog", "Duck", "Horse", "Cow", "Sheep", "Pig",
  "Goat", "Chicken", "Farmer", "Tractor", "Barn", "Tent", "Campfire", "Marshmallow", "Backpack", "Mountain",
  "Hiking", "Tree", "Forest", "Deer", "Owl", "Eagle", "Fox", "Wolf", "Squirrel", "Raccoon",
  "Mushroom", "Flower", "Garden", "Path", "Swing", "Slide", "Sandbox", "Playground", "Kite", "Balloon"
];

export const getWord = () => {
  const randomWord = drawableWords[Math.floor(Math.random() * drawableWords.length)]
  return randomWord;
}

export default drawableWords;
