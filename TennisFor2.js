const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameStarted = false;
let gameOver = false;
let winningScore = 10;

// Spelare
let player1 = {
  x: 50,
  y: canvas.height / 2 - 40,
  w: 22,
  h: 100,
  speed: 11,
  score: 0
};

let player2 = {
  x: canvas.width - 70,
  y: canvas.height / 2 - 40,
  w: 22,
  h: 100,
  speed: 11,
  score: 0
};
const ball_speed = 6.5;

// Boll
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speedX: ball_speed,
  speedY: ball_speed
};

let ballReleased = true;
let delayTime = 500;

let keys = {};

//  Keyboard
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

  if (e.key === " " && !gameStarted) {
    gameStarted = true;
  }

  if (e.key === "r" && gameOver) {
    resetGame();
  }
});

// Update
function update() {

  // PLAYER 1 w och s
  if (keys["w"]) player1.y -= player1.speed;
  if (keys["s"]) player1.y += player1.speed;

  // PLAYER 2  piltangenter
  if (keys["ArrowUp"]) player2.y -= player2.speed;
  if (keys["ArrowDown"]) player2.y += player2.speed;

  // Håll spelare inom canvas
  player1.y = Math.max(0, Math.min(canvas.height - player1.h, player1.y));
  player2.y = Math.max(0, Math.min(canvas.height - player2.h, player2.y));

  // flytta boll
  if (ballReleased) {
  ball.x += ball.speedX;
  ball.y += ball.speedY;
}

  // Studsa på topp och botten
  if (ball.y - ball.radius <= 0 || 
    ball.y + ball.radius >= canvas.height) {
    ball.speedY *= -1;
}

  // Kollision på spelare
  if (
    ball.x - ball.radius < player1.x + player1.w &&
  ball.x + ball.radius > player1.x &&
  ball.y + ball.radius > player1.y &&
  ball.y - ball.radius < player1.y + player1.h
  ) {
    ball.speedX *= -1.075;
  }

  if (
    ball.x - ball.radius < player2.x + player2.w &&
  ball.x + ball.radius > player2.x &&
  ball.y + ball.radius > player2.y &&
  ball.y - ball.radius < player2.y + player2.h
  ) {
    ball.speedX *= -1.075;
  }

  // Poäng
  if (ball.x < 0) {
    player2.score++;
    resetBall();
  }

  if (ball.x > canvas.width) {
    player1.score++;
    resetBall();
  }
  if (ball.x - ball.radius < 0) {
    player2.score++;
    resetBall();
}

if (ball.x + ball.radius > canvas.width) {
    player1.score++;
    resetBall();
}
if (player1.score >= winningScore || player2.score >= winningScore) {
  gameOver = true;
}
}

// Reset boll
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ballReleased = false;

  setTimeout(() => {
    ball.speedX = ball_speed * (Math.random() < 0.5 ? 1 : -1);
    ball.speedY = ball_speed * (Math.random() < 0.5 ? 1 : -1);
    ballReleased = true;
  }, delayTime);  
}
function resetGame() {
  player1.score = 0;
  player2.score = 0;
  gameOver = false;
  gameStarted = false;
  resetBall();
}

// lika
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mittlinje
  ctx.fillStyle = "white";
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.fillRect(canvas.width / 2 - 2, i, 4, 10);
  }

  // Spelare
  ctx.fillRect(player1.x, player1.y, player1.w, player1.h);
  ctx.fillRect(player2.x, player2.y, player2.w, player2.h);

  // Boll
  ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill(); 

  // Poäng
  ctx.font = "40px Arial";
  ctx.fillText(player1.score, canvas.width / 4, 50);
  ctx.fillText(player2.score, canvas.width * 3/4, 50);
}
function drawMenu() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PONG", canvas.width/2, canvas.height/2 - 50);

  ctx.font = "25px Arial";
  ctx.fillText("Press SPACE to Start", canvas.width/2, canvas.height/2);
}
function drawWinner() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";

  let winner = player1.score >= winningScore ? "Player 1 Wins!" : "Player 2 Wins!";

  ctx.fillText(winner, canvas.width/2, canvas.height/2);
  ctx.font = "25px Arial";
  ctx.fillText("Press R to Restart", canvas.width/2, canvas.height/2 + 50);
}
// game loop
function gameLoop() {

  if (!gameStarted) {
    drawMenu();
  } else if (gameOver) {
    drawWinner();
  } else {
    update();
    draw();
  }

  requestAnimationFrame(gameLoop);
} 

gameLoop();