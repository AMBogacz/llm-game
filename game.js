import { player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const eventConsole = document.getElementById('eventConsole');

canvas.width = 800;
canvas.height = 600;

const GRID_SIZE = 40; // Size of each grid square in pixels

function logEvent(message) {
  const timestamp = new Date().toLocaleTimeString();
  const eventLine = document.createElement('p');
  eventLine.textContent = `[${timestamp}] ${message}`;
  eventConsole.appendChild(eventLine);
  eventConsole.scrollTop = eventConsole.scrollHeight;
}

function drawGrid() {
  ctx.strokeStyle = '#333333'; // Dark gray for grid lines
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Click handler for movement
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Snap to grid (optional - remove if you want free movement)
  const gridX = Math.floor(clickX / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
  const gridY = Math.floor(clickY / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

  player.setTarget(gridX, gridY);
  logEvent(`Moving to (${Math.round(gridX)}, ${Math.round(gridY)})`);
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(); // Draw grid first (background)
  player.move(); // Update player position
  player.draw(ctx); // Draw player on top

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
logEvent('Game initialized');
