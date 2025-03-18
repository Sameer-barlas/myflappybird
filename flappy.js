const startupPage = document.getElementById("startup-page");
const levelSelectionPage = document.getElementById("level-selection-page");
const gameContainer = document.getElementById("game-container");
const bird = document.getElementById("bird");
const scoreElement = document.getElementById("score");
const happyBird = document.getElementById("happy-bird");
const newRecordText = document.getElementById("new-record");
const startButton = document.getElementById("start-button");
const playAgainButton = document.getElementById("play-again-button");
const highestScoreElement = document.getElementById("highest-score");
const desktopButton = document.getElementById("desktop-button");
const mobileButton = document.getElementById("mobile-button");
const easyButton = document.getElementById("easy-button");
const mediumButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");
const mobileInterface = document.getElementById("mobile-interface");
const flapButton = document.getElementById("flap-button");

let birdTop = 250; // Initial vertical position of the bird
let gravity = 0.6;
let jumpStrength = -10;
let velocity = 0;
let score = 0;
let pipes = [];
let gameRunning = false;
let pipeInterval;
let pipeGap = 150; // Default gap between pipes
let highestScore = 0; // Track the highest score
let isMobileInterface = false; // Track if mobile interface is active

// Set interface type
desktopButton.addEventListener("click", () => {
  isMobileInterface = false;
  showLevelSelection();
});

mobileButton.addEventListener("click", () => {
  isMobileInterface = true;
  showLevelSelection();
});

// Show level selection page
function showLevelSelection() {
  startupPage.style.display = "none";
  levelSelectionPage.style.display = "block";
}

// Set difficulty level
easyButton.addEventListener("click", () => {
  pipeGap = 200; // Larger gap for Easy mode
  startGame();
});

mediumButton.addEventListener("click", () => {
  pipeGap = 150; // Medium gap for Medium mode
  startGame();
});

hardButton.addEventListener("click", () => {
  pipeGap = 100; // Smaller gap for Hard mode
  startGame();
});

// Start the game
function startGame() {
  levelSelectionPage.style.display = "none"; // Hide level selection page
  gameContainer.style.display = "block"; // Show game container
  if (isMobileInterface) {
    mobileInterface.style.display = "block"; // Show mobile interface
  }
  resetGame();
}

// Move the bird
function updateBird() {
  if (!gameRunning) return;

  velocity += gravity;
  birdTop += velocity;
  bird.style.top = birdTop + "px";

  // Check for collisions with ground or ceiling
  if (birdTop >= gameContainer.clientHeight - bird.clientHeight || birdTop <= 0) {
    endGame();
  }
}

// Create pipes
function createPipe() {
  if (!gameRunning) return;

  const pipeWidth = 60;
  const minHeight = 50;
  const maxHeight = gameContainer.clientHeight - pipeGap - minHeight;

  const pipeHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

  const topPipe = document.createElement("div");
  topPipe.className = "pipe";
  topPipe.style.height = pipeHeight + "px";
  topPipe.style.top = "0";
  topPipe.style.left = gameContainer.clientWidth + "px";

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe";
  bottomPipe.style.height = (gameContainer.clientHeight - pipeHeight - pipeGap) + "px";
  bottomPipe.style.bottom = "0";
  bottomPipe.style.left = gameContainer.clientWidth + "px";

  gameContainer.appendChild(topPipe);
  gameContainer.appendChild(bottomPipe);

  pipes.push({ topPipe, bottomPipe });
}

// Move pipes
function movePipes() {
  if (!gameRunning) return;

  pipes.forEach((pipe, index) => {
    const currentLeft = parseInt(pipe.topPipe.style.left);
    pipe.topPipe.style.left = currentLeft - 2 + "px";
    pipe.bottomPipe.style.left = currentLeft - 2 + "px";

    // Remove pipes that are off-screen
    if (currentLeft < -60) {
      gameContainer.removeChild(pipe.topPipe);
      gameContainer.removeChild(pipe.bottomPipe);
      pipes.splice(index, 1);
      score++;
      scoreElement.textContent = score;

      // Update highest score and show happy bird with "New Record" text
      if (score > highestScore) {
        highestScore = score;
        highestScoreElement.textContent = `Highest Score: ${highestScore}`;
        happyBird.style.display = "block"; // Show happy bird
        newRecordText.style.display = "block"; // Show "New Record" text
        setTimeout(() => {
          happyBird.style.display = "none"; // Hide happy bird after 1 second
          newRecordText.style.display = "none"; // Hide "New Record" text after 1 second
        }, 1000);
      }
    }

    // Check for collisions with pipes
    if (
      currentLeft < 90 &&
      currentLeft > 30 &&
      (birdTop < parseInt(pipe.topPipe.style.height) ||
        birdTop > gameContainer.clientHeight - parseInt(pipe.bottomPipe.style.height))
    ) {
      endGame();
    }
  });
}

// End the game
function endGame() {
  gameRunning = false;
  clearInterval(pipeInterval); // Stop creating new pipes
  playAgainButton.style.display = "block";
  alert("Game Over! Your score: " + score);
}

// Reset the game
function resetGame() {
  birdTop = 250; // Reset bird position to the middle
  velocity = 0;
  score = 0;
  scoreElement.textContent = score;
  bird.style.top = birdTop + "px"; // Apply the reset position
  pipes.forEach(pipe => {
    gameContainer.removeChild(pipe.topPipe);
    gameContainer.removeChild(pipe.bottomPipe);
  });
  pipes = [];
  playAgainButton.style.display = "none";
}

// Game loop
function gameLoop() {
  updateBird();
  movePipes();
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Jump on spacebar press or touch
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameRunning && !isMobileInterface) {
    velocity = jumpStrength;
  }
});

flapButton.addEventListener("click", () => {
  if (gameRunning && isMobileInterface) {
    velocity = jumpStrength;
  }
});

// Start the game
startButton.addEventListener("click", () => {
  gameRunning = true;
  startButton.style.display = "none"; // Hide the Start button
  resetGame(); // Reset the game state before starting
  gameLoop();
  pipeInterval = setInterval(createPipe, 1500); // Start creating pipes
});

// Play again
playAgainButton.addEventListener("click", () => {
  resetGame();
  gameRunning = true;
  playAgainButton.style.display = "none";
  gameLoop();
  pipeInterval = setInterval(createPipe, 1500); // Start creating pipes
});