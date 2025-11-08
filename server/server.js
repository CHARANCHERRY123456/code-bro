import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { setupWebSocketServer } from './websocket.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Setup WebSocket server for collaborative editing
setupWebSocketServer(server);

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
    console.log("WebSocket available at ws://localhost:" + PORT);
});