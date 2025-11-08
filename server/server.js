import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import http from "http";
import { WebSocketServer } from "ws";
import * as Y from "yjs";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const docs = new Map();

wss.on("connection", (ws, req) => {
    console.log(req.url);
    
  const docName = req.url.slice(1).split("?")[0];
  console.log(`✅ Connected: ${docName}`);

  if (!docs.has(docName)) {
    docs.set(docName, new Y.Doc());
  }
  const doc = docs.get(docName);

  ws.on("message", (data) => {
    // Broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    });

    // Apply update to document
    try {
      Y.applyUpdate(doc, new Uint8Array(data));
    } catch (e) {}
  });

  ws.on("close", () => {
    console.log(`❌ Disconnected: ${docName}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket: ws://localhost:${PORT}`);
});
