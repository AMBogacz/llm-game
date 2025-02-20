import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from './controllers/gameController.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupWebSocket(wss);

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
