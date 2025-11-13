import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import http from "http";
import { WebSocketServer } from "ws";
import * as Y from "yjs";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store documents and their awareness instances
const docs = new Map();
const awarenessStates = new Map();

const messageSync = 0;
const messageAwareness = 1;

function getYDoc(docName) {
  if (!docs.has(docName)) {
    const doc = new Y.Doc();
    docs.set(docName, doc);
    console.log(`📝 Created new document: ${docName}`);
  }
  return docs.get(docName);
}

function getAwareness(docName) {
  if (!awarenessStates.has(docName)) {
    const ydoc = getYDoc(docName);
    const awareness = new awarenessProtocol.Awareness(ydoc);
    awarenessStates.set(docName, awareness);
  }
  return awarenessStates.get(docName);
}

wss.on("connection", (ws, req) => {
  const docName = req.url?.slice(1).split("?")[0] || 'default';
  console.log(`✅ Client connected to document: ${docName}`);

  const ydoc = getYDoc(docName);
  const awareness = getAwareness(docName);

  // Send sync step 1
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, ydoc);
  ws.send(encoding.toUint8Array(encoder));

  // Send current awareness states
  if (awareness.getStates().size > 0) {
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, messageAwareness);
    encoding.writeVarUint8Array(
      awarenessEncoder,
      awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(awareness.getStates().keys()))
    );
    ws.send(encoding.toUint8Array(awarenessEncoder));
  }

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const uint8Array = new Uint8Array(message);
      const decoder = decoding.createDecoder(uint8Array);
      const messageType = decoding.readVarUint(decoder);

      if (messageType === messageSync) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.readSyncMessage(decoder, encoder, ydoc, null);
        
        // Send sync response back to sender
        if (encoding.length(encoder) > 1) {
          ws.send(encoding.toUint8Array(encoder));
        }

        // Broadcast the original update to all other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(uint8Array);
          }
        });
      } else if (messageType === messageAwareness) {
        awarenessProtocol.applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), null);
        
        // Broadcast awareness to all other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(uint8Array);
          }
        });
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    console.log(`❌ Client disconnected from: ${docName}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket: ws://localhost:${PORT}`);
});
