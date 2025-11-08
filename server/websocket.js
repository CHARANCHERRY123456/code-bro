import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import * as encoding from 'lib0/encoding.js';
import * as decoding from 'lib0/decoding.js';
import * as map from 'lib0/map.js';

const docs = new Map();
const messageSync = 0;
const messageAwareness = 1;

const getYDoc = (docname) => map.setIfUndefined(docs, docname, () => new Y.Doc());

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const docName = request.url.slice(1);
    
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, docName);
    });
  });

  wss.on('connection', (ws, request, docName) => {
    ws.binaryType = 'arraybuffer';
    const doc = getYDoc(docName);
    
    console.log(`✅ Client connected to room: ${docName}`);

    // Send Step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    ws.send(encoding.toUint8Array(encoder));

    const awarenessStates = doc.getMap('awareness');

    ws.on('message', (message) => {
      try {
        const decoder = decoding.createDecoder(new Uint8Array(message));
        const messageType = decoding.readVarUint(decoder);

        if (messageType === messageSync) {
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, messageSync);
          
          const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, doc, null);
          
          if (encoding.length(encoder) > 1) {
            ws.send(encoding.toUint8Array(encoder));
          }

          // Broadcast to other clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
              client.send(message);
            }
          });
        } else if (messageType === messageAwareness) {
          // Broadcast awareness updates
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
              client.send(message);
            }
          });
        }
      } catch (err) {
        console.error('❌ Error:', err.message);
      }
    });

    ws.on('close', () => {
      console.log(`❌ Client disconnected from room: ${docName}`);
    });
  });

  console.log('🚀 Yjs WebSocket server ready');
}
