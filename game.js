import { player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const eventConsole = document.getElementById('eventConsole');

canvas.width = 800;
canvas.height = 600;

const TILE_WIDTH = 40;
const TILE_HEIGHT = 20;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 22;

// Camera offset (initially centered)
let cameraX =
  (canvas.width - (GRID_WIDTH + GRID_HEIGHT) * (TILE_WIDTH / 2)) / 2 +
  TILE_WIDTH / 2;
let cameraY =
  (canvas.height - (GRID_WIDTH + GRID_HEIGHT) * (TILE_HEIGHT / 2)) / 2;

// Mouse tracking
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let clickTimer = null;
const CLICK_THRESHOLD = 200; // Milliseconds to distinguish click from drag

function logEvent(message) {
  const timestamp = new Date().toLocaleTimeString();
  const eventLine = document.createElement('p');
  eventLine.textContent = `[${timestamp}] ${message}`;
  eventConsole.appendChild(eventLine);
  eventConsole.scrollTop = eventConsole.scrollHeight;
}

function drawGrid() {
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;

  for (let y = 0; y <= GRID_HEIGHT; y++) {
    for (let x = 0; x <= GRID_WIDTH; x++) {
      const screenX = cameraX + (x - y) * (TILE_WIDTH / 2);
      const screenY = cameraY + (x + y) * (TILE_HEIGHT / 2);

      ctx.beginPath();
      ctx.moveTo(screenX, screenY - TILE_HEIGHT / 2);
      ctx.lineTo(screenX + TILE_WIDTH / 2, screenY);
      ctx.lineTo(screenX, screenY + TILE_HEIGHT / 2);
      ctx.lineTo(screenX - TILE_WIDTH / 2, screenY);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function screenToGrid(x, y) {
  const adjustedX = x - cameraX;
  const adjustedY = y - cameraY;

  const gridX =
    (adjustedX / (TILE_WIDTH / 2) + adjustedY / (TILE_HEIGHT / 2)) / 2;
  const gridY =
    (adjustedY / (TILE_HEIGHT / 2) - adjustedX / (TILE_WIDTH / 2)) / 2;

  return {
    x: Math.round(gridX),
    y: Math.round(gridY),
  };
}

// Mouse event handlers
canvas.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    // Left mouse button
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    // Start a timer to detect if this becomes a drag
    clickTimer = setTimeout(() => {
      isDragging = true;
      clickTimer = null;
    }, CLICK_THRESHOLD);
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    cameraX += deltaX;
    cameraY += deltaY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

canvas.addEventListener('mouseup', (event) => {
  if (event.button === 0) {
    if (clickTimer) {
      // If timer exists, it was a click, not a drag
      clearTimeout(clickTimer);
      clickTimer = null;

      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const gridPos = screenToGrid(clickX, clickY);
      if (
        gridPos.x >= 0 &&
        gridPos.x < GRID_WIDTH &&
        gridPos.y >= 0 &&
        gridPos.y < GRID_HEIGHT
      ) {
        player.setTarget(gridPos.x, gridPos.y);
        logEvent(`Moving to grid (${gridPos.x}, ${gridPos.y})`);
      }
    }
    isDragging = false;
  }
});

canvas.addEventListener('mouseleave', () => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  isDragging = false;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  player.move();
  player.draw(ctx, cameraX, cameraY, TILE_WIDTH, TILE_HEIGHT);

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
logEvent('Game initialized');
