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
  if (player) {
    player.gridX = gridX;
    player.gridY = gridY;

    console.log(
      `Player ${player.name} (${playerId}) moved to (${gridX}, ${gridY})`,
    ); // Log the event

    // Broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
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

export function getAllPlayers() {
  return Array.from(players.values());
}
