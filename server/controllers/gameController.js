import {
  handlePlayerMove,
  handlePlayerDisconnect,
  handlePlayerConnect,
  getAllPlayers,
} from '../models/playerModel.js';

export function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'init') {
        const playerId = Math.random().toString(36).substring(2, 15);
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
      } else if (data.type === 'move') {
        handlePlayerMove(data.id, data.gridX, data.gridY, ws, wss);
      }
    });

    ws.on('close', () => {
      const player = getAllPlayers().find((p) => p.ws === ws);
      if (player) {
        handlePlayerDisconnect(player.id, ws, wss);
      }
    });
  });
}
