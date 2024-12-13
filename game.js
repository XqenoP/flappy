const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird variables
let birdY;
let birdX = 50;
let birdSpeed;
let gravity = 0.3;  // Lighter gravity for smoother falling
let lift = -6;      // Even smaller flap force to keep the bird's jump low
let birdWidth = 20;
let birdHeight = 20;

// Pipe variables
let pipes;
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;
let pipeInterval = 1500; // Pipe spawn interval in ms

// Game state
let score;
let gameOverFlag;
let pipeCreationInterval;

function resetGame() {
    // Reset bird and game state
    birdY = canvas.height / 2;
    birdSpeed = 0;
    pipes = [];
    score = 0;
    gameOverFlag = false;
    pipeCreationInterval = setInterval(createPipe, pipeInterval); // Start pipe generation again
    gameLoop();
}

// Draw Bird
function drawBird() {
    ctx.fillStyle = '#FF0';
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
}

// Draw Pipes
function drawPipes() {
    pipes.forEach((pipe, index) => {
        ctx.fillStyle = '#008000';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight); // Top pipe
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap); // Bottom pipe

        // Move pipes to the left
        pipe.x -= pipeSpeed;

        // Remove pipes when they go off-screen
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

// Create new Pipe
function createPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap); // Random height for top pipe
    pipes.push({
        x: canvas.width,
        topHeight: topHeight
    });
}

// Handle Bird movement and collision
function update() {
    birdSpeed += gravity;  // Apply gravity to bird
    birdY += birdSpeed;    // Update bird's vertical position

    // Prevent bird from flying too high
    if (birdY < 0) {
        birdY = 0; // Keep the bird at the top of the canvas
        birdSpeed = 0; // Stop upward motion if it reaches the top
    }

    // Collision with the ground
    if (birdY > canvas.height - birdHeight) {
        birdY = canvas.height - birdHeight; // Prevent bird from going below the canvas
        gameOver(); // Bird hits the ground (game over)
    }

    // Check for collision with pipes
    pipes.forEach(pipe => {
        if (
            birdX + birdWidth > pipe.x &&
            birdX < pipe.x + pipeWidth &&
            (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap)
        ) {
            gameOver(); // Bird collides with a pipe (game over)
        }
    });
}

// Draw the score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Game Over function
function gameOver() {
    if (!gameOverFlag) {
        gameOverFlag = true;
        ctx.font = '30px Arial';
        ctx.fillStyle = '#FF0';
        ctx.fillText('Game Over! Press Space or Enter to Restart', canvas.width / 2 - 180, canvas.height / 2);
    }

    // Stop the game loop
    clearInterval(pipeCreationInterval);
    cancelAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();
    update();

    if (!gameOverFlag) {
        requestAnimationFrame(gameLoop);
    }
}

// Handle keypress for bird movement (flap)
function handleKeyPress(event) {
    if (event.key === ' ' || event.key === 'ArrowUp') {
        if (!gameOverFlag) {
            birdSpeed = lift; // Make the bird "flap"
        } else {
            // Restart the game if space or enter is pressed after game over
            if (event.key === ' ' || event.key === 'Enter') {
                resetGame();
            }
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Initial game setup
function init() {
    resetGame();
}

init();
