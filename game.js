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

// Click handler for movement
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  player.setTarget(clickX, clickY);
  logEvent(`Moving to (${Math.round(clickX)}, ${Math.round(clickY)})`);
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.move(); // Update player position
  player.draw(ctx); // Draw player at new position

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
logEvent('Game initialized');
