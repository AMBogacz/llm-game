import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const eventConsole = document.getElementById('eventConsole') as HTMLDivElement;

canvas.width = 800;
canvas.height = 600;

const TILE_WIDTH: number = 40;
const TILE_HEIGHT: number = 20;
const GRID_WIDTH: number = 30;
const GRID_HEIGHT: number = 22;

let cameraX: number =
  (canvas.width - (GRID_WIDTH + GRID_HEIGHT) * (TILE_WIDTH / 2)) / 2 +
  TILE_WIDTH / 2;
let cameraY: number =
  (canvas.height - (GRID_WIDTH + GRID_HEIGHT) * (TILE_HEIGHT / 2)) / 2;

let isDragging: boolean = false;
let lastMouseX: number = 0;
let lastMouseY: number = 0;
let clickTimer: NodeJS.Timeout | null = null;
const CLICK_THRESHOLD: number = 200;

const player: Player = new Player();
let ws: WebSocket;

function logEvent(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  const eventLine = document.createElement('p');
  eventLine.textContent = `[${timestamp}] ${message}`;
  eventConsole.appendChild(eventLine);
  eventConsole.scrollTop = eventConsole.scrollHeight;
}

function drawGrid(): void {
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;

  for (let y = 0; y <= GRID_HEIGHT; y++) {
    for (let x = 0; y <= GRID_WIDTH; x++) {
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

function screenToGrid(x: number, y: number): { x: number; y: number } {
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

// WebSocket setup
function initWebSocket(): void {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    logEvent('Connected to server');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'move') {
      player.setTarget(data.gridX, data.gridY);
      logEvent(`Server moved player to (${data.gridX}, ${data.gridY})`);
    }
  };

  ws.onclose = () => {
    logEvent('Disconnected from server');
  };
}

// Mouse event handlers
canvas.addEventListener('mousedown', (event: MouseEvent) => {
  if (event.button === 0) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    clickTimer = setTimeout(() => {
      isDragging = true;
      clickTimer = null;
    }, CLICK_THRESHOLD);
  }
});

canvas.addEventListener('mousemove', (event: MouseEvent) => {
  if (isDragging) {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    cameraX += deltaX;
    cameraY += deltaY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

canvas.addEventListener('mouseup', (event: MouseEvent) => {
  if (event.button === 0) {
    if (clickTimer) {
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
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'move',
              gridX: gridPos.x,
              gridY: gridPos.y,
            }),
          );
        }
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

function gameLoop(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  player.move();
  player.draw(ctx, cameraX, cameraY, TILE_WIDTH, TILE_HEIGHT);

  requestAnimationFrame(gameLoop);
}

// Start game
initWebSocket();
gameLoop();
logEvent('Game initialized');
