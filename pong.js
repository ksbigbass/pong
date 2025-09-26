const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 12, paddleHeight = 80;
const ballSize = 14;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let leftY = canvasHeight / 2 - paddleHeight / 2;
let rightY = canvasHeight / 2 - paddleHeight / 2;
let leftScore = 0, rightScore = 0;

let ballX = canvasWidth / 2 - ballSize / 2;
let ballY = canvasHeight / 2 - ballSize / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = (Math.random() * 4 - 2);

const paddleSpeed = 8;
let leftPaddleMove = 0; // -1 for up, 1 for down

function drawRect(x, y, w, h, color='#fff') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x + ballSize/2, y + ballSize/2, ballSize/2, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  for(let i = 0; i < canvasHeight; i += 30) {
    ctx.beginPath();
    ctx.moveTo(canvasWidth/2, i);
    ctx.lineTo(canvasWidth/2, i+15);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawNet();
  drawRect(0, leftY, paddleWidth, paddleHeight);
  drawRect(canvasWidth - paddleWidth, rightY, paddleWidth, paddleHeight);
  drawBall(ballX, ballY);
}

function updateScore() {
  document.getElementById('score-left').textContent = leftScore;
  document.getElementById('score-right').textContent = rightScore;
}

function resetBall() {
  ballX = canvasWidth / 2 - ballSize / 2;
  ballY = canvasHeight / 2 - ballSize / 2;
  ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
  ballSpeedY = (Math.random() * 4 - 2);
}

function moveLeftPaddle() {
  leftY += leftPaddleMove * paddleSpeed;
  leftY = Math.max(0, Math.min(canvasHeight - paddleHeight, leftY));
}

// Mouse movement for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftY = mouseY - paddleHeight / 2;
  leftY = Math.max(0, Math.min(canvasHeight - paddleHeight, leftY));
});

// Arrow keys for left paddle
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") leftPaddleMove = -1;
  if (e.key === "ArrowDown") leftPaddleMove = 1;
});
document.addEventListener('keyup', (e) => {
  if (e.key === "ArrowUp" && leftPaddleMove === -1) leftPaddleMove = 0;
  if (e.key === "ArrowDown" && leftPaddleMove === 1) leftPaddleMove = 0;
});

function moveRightPaddle() {
  // Simple AI: Move towards ball
  let target = ballY + ballSize/2 - paddleHeight/2;
  // Smooth movement
  if (rightY < target) rightY += Math.min(5, target - rightY);
  else if (rightY > target) rightY -= Math.min(5, rightY - target);
  rightY = Math.max(0, Math.min(canvasHeight - paddleHeight, rightY));
}

function ballPhysics() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY <= 0) {
    ballY = 0;
    ballSpeedY *= -1;
  }
  if (ballY + ballSize >= canvasHeight) {
    ballY = canvasHeight - ballSize;
    ballSpeedY *= -1;
  }

  // Left paddle collision
  if (
    ballX <= paddleWidth &&
    ballY + ballSize > leftY &&
    ballY < leftY + paddleHeight
  ) {
    ballX = paddleWidth;
    ballSpeedX *= -1.1;
    ballSpeedY += (Math.random() - 0.5) * 2;
  }
  // Right paddle collision
  if (
    ballX + ballSize >= canvasWidth - paddleWidth &&
    ballY + ballSize > rightY &&
    ballY < rightY + paddleHeight
  ) {
    ballX = canvasWidth - paddleWidth - ballSize;
    ballSpeedX *= -1.1;
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Left miss
  if (ballX < -ballSize) {
    rightScore++;
    updateScore();
    resetBall();
  }
  // Right miss
  if (ballX > canvasWidth + ballSize) {
    leftScore++;
    updateScore();
    resetBall();
  }
}

function gameLoop() {
  moveLeftPaddle();
  moveRightPaddle();
  ballPhysics();
  draw();
  requestAnimationFrame(gameLoop);
}

updateScore();
gameLoop();