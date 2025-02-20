import { player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const eventConsole = document.getElementById('eventConsole');

canvas.width = 800;
canvas.height = 600;

function logEvent(message) {
  const timestamp = new Date().toLocaleTimeString();
  const eventLine = document.createElement('p');
  eventLine.textContent = `[${timestamp}] ${message}`;
  eventConsole.appendChild(eventLine);
  eventConsole.scrollTop = eventConsole.scrollHeight;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw(ctx);

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
logEvent('Game initialized');
