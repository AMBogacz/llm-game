const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;

// Initialize the grid with empty cells
const grid = Array.from({ length: GRID_HEIGHT }, () =>
  Array.from({ length: GRID_WIDTH }, () => ({
    type: 'empty', // 'empty', 'obstacle', or 'player'
    playerId: null, // ID of the player if the cell contains a player
  })),
);

const players = new Map();

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function handlePlayerConnect(playerId, playerName, ws, wss) {
  const player = {
    id: playerId,
    name: playerName,
    gridX: 15,
    gridY: 11,
    color: getRandomColor(),
  };
  players.set(playerId, player);
  placePlayer(player.gridX, player.gridY, playerId);
  console.log(`Player ${playerName} (${playerId}) connected`); // Log the event

  // Broadcast new player to all other clients
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'newPlayer',
          id: playerId,
          name: playerName,
          gridX: player.gridX,
          gridY: player.gridY,
          color: player.color,
        }),
      );
    }
  });
}

export function handlePlayerMove(playerId, gridX, gridY, ws, wss) {
  const player = players.get(playerId);
  if (
    player &&
    grid[gridY] &&
    grid[gridY][gridX] &&
    grid[gridY][gridX].type === 'empty'
  ) {
    movePlayer(player.gridX, player.gridY, gridX, gridY, playerId);
    player.gridX = gridX;
    player.gridY = gridY;

    console.log(
      `Player ${player.name} (${playerId}) moved to (${gridX}, ${gridY})`,
    ); // Log the event

    // Broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'move',
            id: playerId, // Include playerId in the broadcast message
            gridX,
            gridY,
          }),
        );
      }
    });
  }
}

export function handlePlayerDisconnect(playerId, ws, wss) {
  const player = players.get(playerId);
  if (player) {
    removePlayer(player.gridX, player.gridY, playerId);
    players.delete(playerId);
    console.log(`Player ${player.name} (${playerId}) disconnected`); // Log the event

    // Broadcast player disconnection to all other clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'removePlayer',
            id: playerId,
          }),
        );
      }
    });
  }
}

export function handlePlaceObstacle(gridX, gridY, ws, wss) {
  if (
    grid[gridY] &&
    grid[gridY][gridX] &&
    grid[gridY][gridX].type === 'empty'
  ) {
    placeObstacle(gridX, gridY);
    console.log(`Obstacle placed at (${gridX}, ${gridY})`); // Log the event

    // Broadcast new obstacle to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'obstacle',
            gridX,
            gridY,
          }),
        );
      }
    });
  }
}

export function getAllPlayers() {
  return Array.from(players.values());
}

export function getAllObstacles() {
  const obstacles = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x].type === 'obstacle') {
        obstacles.push({ gridX: x, gridY: y });
      }
    }
  }
  return obstacles;
}

// Grid manipulation functions

function placeObstacle(gridX, gridY) {
  grid[gridY][gridX] = { type: 'obstacle', playerId: null };
}

function removeObstacle(gridX, gridY) {
  if (grid[gridY][gridX].type === 'obstacle') {
    grid[gridY][gridX] = { type: 'empty', playerId: null };
  }
}

function placePlayer(gridX, gridY, playerId) {
  grid[gridY][gridX] = { type: 'player', playerId: playerId };
}

function movePlayer(oldGridX, oldGridY, newGridX, newGridY, playerId) {
  if (
    grid[oldGridY][oldGridX].type === 'player' &&
    grid[oldGridY][oldGridX].playerId === playerId
  ) {
    grid[oldGridY][oldGridX] = { type: 'empty', playerId: null };
    grid[newGridY][newGridX] = { type: 'player', playerId: playerId };
  }
}

function removePlayer(gridX, gridY, playerId) {
  if (
    grid[gridY][gridX].type === 'player' &&
    grid[gridY][gridX].playerId === playerId
  ) {
    grid[gridY][gridX] = { type: 'empty', playerId: null };
  }
}
