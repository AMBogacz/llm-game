import { Player } from './player.js';
import { drawGrid } from './grid.js';
import { Camera } from './camera.js';
import { logEvent } from './logger.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const eventConsole = document.getElementById('eventConsole');

canvas.width = 800;
canvas.height = 600;

const player = new Player();
const camera = new Camera(canvas.width, canvas.height);
let ws;

function initWebSocket() {
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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, camera);
  player.move();
  player.draw(
    ctx,
    camera.offsetX,
    camera.offsetY,
    camera.tileWidth,
    camera.tileHeight,
  );

  requestAnimationFrame(gameLoop);
}

// Mouse event handlers
canvas.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    camera.startDragging(event.clientX, event.clientY);
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (camera.isDragging) {
    camera.drag(event.clientX, event.clientY);
  }
});

canvas.addEventListener('mouseup', (event) => {
  if (event.button === 0) {
    camera.stopDragging(event.clientX, event.clientY, (gridX, gridY) => {
      player.setTarget(gridX, gridY);
      logEvent(`Moving to grid (${gridX}, ${gridY})`);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'move',
            gridX,
            gridY,
          }),
        );
      }
    });
  }
});

canvas.addEventListener('mouseleave', () => {
  camera.cancelDragging();
});

// Start game
initWebSocket();
gameLoop();
logEvent('Game initialized');
