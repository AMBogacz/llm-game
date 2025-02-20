import { Player } from './player.js';
import { drawGrid } from './grid.js';
import { Camera } from './camera.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nameInputContainer = document.getElementById('nameInputContainer');
const nameInput = document.getElementById('nameInput');
const startButton = document.getElementById('startButton');

canvas.width = 800;
canvas.height = 600;

let player;
const camera = new Camera(canvas.width, canvas.height);
let ws;
let retryTimeout;
const otherPlayers = new Map();

startButton.addEventListener('click', () => {
  const playerName = nameInput.value.trim();
  if (playerName) {
    nameInputContainer.style.display = 'none';
    canvas.style.display = 'block';
    initWebSocket(playerName);
  } else {
    alert('Please enter a name');
  }
});

function initWebSocket(playerName) {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to server');
    ws.send(JSON.stringify({ type: 'init', name: playerName }));
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'init') {
      player = new Player(data.id, data.name, data.color);
    } else if (data.type === 'move') {
      if (data.id === player.id) {
        player.setTarget(data.gridX, data.gridY);
      } else {
        let otherPlayer = otherPlayers.get(data.id);
        if (!otherPlayer) {
          otherPlayer = new Player(data.id, data.name, data.color);
          otherPlayers.set(data.id, otherPlayer);
        }
        otherPlayer.setTarget(data.gridX, data.gridY);
      }
      console.log(
        `Server moved player ${data.name} to (${data.gridX}, ${data.gridY})`,
      );
    } else if (data.type === 'players') {
      otherPlayers.clear(); // Clear the map before adding current players
      data.players.forEach((p) => {
        if (p.id !== player.id) {
          let otherPlayer = new Player(p.id, p.name, p.color);
          otherPlayer.gridX = p.gridX;
          otherPlayer.gridY = p.gridY;
          otherPlayers.set(p.id, otherPlayer);
        }
      });
    } else if (data.type === 'newPlayer') {
      if (data.id !== player.id) {
        let otherPlayer = new Player(data.id, data.name, data.color);
        otherPlayer.gridX = data.gridX;
        otherPlayer.gridY = data.gridY;
        otherPlayers.set(data.id, otherPlayer);
        console.log(
          `New player ${data.name} joined at (${data.gridX}, ${data.gridY})`,
        );
      }
    } else if (data.type === 'removePlayer') {
      otherPlayers.delete(data.id);
      console.log(`Player ${data.name} disconnected`);
    }
  };

  ws.onclose = () => {
    console.log('Disconnected from server');
    retryConnection(playerName);
  };
}

function retryConnection(playerName) {
  if (!retryTimeout) {
    retryTimeout = setTimeout(() => {
      console.log('Attempting to reconnect...');
      initWebSocket(playerName);
    }, 5000); // Retry every 5 seconds
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, camera);
  if (player) {
    player.move();
    player.draw(
      ctx,
      camera.offsetX,
      camera.offsetY,
      camera.tileWidth,
      camera.tileHeight,
    );
  }

  otherPlayers.forEach((otherPlayer, id) => {
    otherPlayer.move();
    otherPlayer.drawOther(
      ctx,
      camera.offsetX,
      camera.offsetY,
      camera.tileWidth,
      camera.tileHeight,
      otherPlayer.name,
    );
  });

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
      console.log(`Moving to grid (${gridX}, ${gridY})`);
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
gameLoop();
console.log('Game initialized');
