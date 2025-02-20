import {
  handlePlayerMove,
  handlePlayerDisconnect,
  handlePlayerConnect,
  handlePlaceObstacle,
  getAllPlayers,
  getAllObstacles,
} from '../models/playerModel.js';

export function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    const playerId = Math.random().toString(36).substring(2, 15);

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'init') {
        handlePlayerConnect(playerId, data.name, ws, wss);

        const player = getAllPlayers().find((p) => p.id === playerId);
        ws.send(
          JSON.stringify({
            type: 'init',
            id: playerId,
            name: player.name,
            color: player.color,
          }),
        );
        ws.send(JSON.stringify({ type: 'players', players: getAllPlayers() }));
        ws.send(
          JSON.stringify({ type: 'obstacles', obstacles: getAllObstacles() }),
        );
      } else if (data.type === 'move') {
        handlePlayerMove(playerId, data.gridX, data.gridY, ws, wss);
      } else if (data.type === 'placeObstacle') {
        handlePlaceObstacle(data.gridX, data.gridY, ws, wss);
      }
    });

    ws.on('close', () => {
      handlePlayerDisconnect(playerId, ws, wss);
    });
  });
}
