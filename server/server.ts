import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import * as http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface PlayerData {
  id: string;
  gridX: number;
  gridY: number;
}

const players: Map<string, PlayerData> = new Map();

wss.on('connection', (ws: WebSocket) => {
  const playerId = Math.random().toString(36).substring(2, 15);
  players.set(playerId, { id: playerId, gridX: 15, gridY: 11 });
  console.log(`Player ${playerId} connected`);

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    if (data.type === 'move') {
      const player = players.get(playerId);
      if (player) {
        player.gridX = data.gridX;
        player.gridY = data.gridY;

        // Broadcast to all other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'move',
                gridX: data.gridX,
                gridY: data.gridY,
              }),
            );
          }
        });
      }
    }
  });

  ws.on('close', () => {
    players.delete(playerId);
    console.log(`Player ${playerId} disconnected`);
  });
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
