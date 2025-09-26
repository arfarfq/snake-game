const board = document.getElementById("game-board"); 
const width = 20;
const height = 20;
let direction = 1; // default moving right
const cells = [];
let snake = []; // Array of cell indices
let score = 0;
let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;



function initializeGameBoard() {
    // Create a 20x20 grid
    for (let i = 0; i < width * height; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
        cells.push(cell); // Add cell to global array
    }
}

function placeFood() {
    const randomIndex = Math.floor(Math.random() * (width * height));
    
    if (snake.includes(randomIndex)) {
        return placeFood(); 
    }

    const randomCell = cells[randomIndex];
    randomCell.classList.add("food"); 
}



function startGame() {


    cells.forEach(cell => cell.classList.remove("snake", "head", "food"));
    snake = [];
    score = 0;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("high-score").innerText = `High Score: ${highScore}`;



    placeFood();

    // Pick a random start position
    const startIndex = Math.floor(Math.random() * (
    width * height));
    snake = [startIndex];
    cells[startIndex].classList.add("snake", "head");

    // Always start moving right (safer than random directions)
    if (startIndex % width === width - 1) direction = -1; // If on right edge, go left
    else direction = 1;

    // Start game loop
    gameLoop = setInterval(moveSnake, 150);
}

function moveSnake() {
    const headIndex = snake[0];
    const newHeadIndex = headIndex + direction;

    // Check for collisions
    if (
        newHeadIndex < 0 || // Top wall
        newHeadIndex >= width * height || // Bottom wall
        (direction === 1 && headIndex % width === width - 1) || // Right wall
        (direction === -1 && headIndex % width === 0) || // Left wall
        snake.includes(newHeadIndex) // Self collision
    ) {
        clearInterval(gameLoop);
        document.getElementById("game-over").style.display = "block";
    }

    // Move snake
    snake.unshift(newHeadIndex);
    cells[newHeadIndex].classList.add("snake", "head");
    cells[headIndex].classList.remove("head");

    // Check for food
    if (cells[newHeadIndex].classList.contains("food")) {
        cells[newHeadIndex].classList.remove("food");
        placeFood(); // Place new food
    } else {
        const tailIndex = snake.pop();
        cells[tailIndex].classList.remove("snake");
    }

    score = snake.length - 1;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        document.getElementById("high-score").innerText = `High Score: ${highScore}`;
    }
    document.getElementById("score").innerText = `Score: ${score}`;
    
    
}


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== width) direction = -width;
    if (e.key === "ArrowDown" && direction !== -width) direction = width;
    if (e.key === "ArrowLeft" && direction !== 1) direction = -1;
    if (e.key === "ArrowRight" && direction !== -1) direction = 1;
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.getElementById("game-over").style.display === "block") {
        document.getElementById("game-over").style.display = "none";
        score = 0;
        document.getElementById("score").innerText = `Score: ${score}`;
        startGame();
    }
});



// Initialize and start
initializeGameBoard();
startGame();


