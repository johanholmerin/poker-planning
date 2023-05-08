import { ServerOptions, WebSocketServer, WebSocket } from 'ws';
import { ClientMessage } from '../shared/messages';
import { Message } from './validation';

function parseMessage(input: string) {
  try {
    return Message.safeParse(JSON.parse(input));
  } catch (error) {
    return { success: false } as const;
  }
}

function send(ws: WebSocket | null, message: ClientMessage) {
  ws?.send(JSON.stringify(message));
}

export function createServer(options: ServerOptions) {
  const wss = new WebSocketServer(options);

  const CLIENTS: (WebSocket | null)[] = [];

  wss.on('connection', (ws) => {
    // Initial CONNECT messages
    CLIENTS.forEach((client, clientId) => {
      if (client) {
        const message = { type: 'CONNECT', clientId } as const;
        send(ws, message);
      }
    });

    CLIENTS.push(ws);

    ws.on('message', (data) => {
      const message = parseMessage(data.toString());
      if (!message.success) {
        console.error('Invalid message', data);
        return;
      }

      const clientId = CLIENTS.indexOf(ws);
      CLIENTS.forEach((client) => {
        if (client !== ws) {
          const response = { ...message.data, clientId };
          send(client, response);
        }
      });
    });

    ws.on('close', () => {
      const clientId = CLIENTS.indexOf(ws);
      CLIENTS.forEach((client) => {
        if (client !== ws) {
          const response = { type: 'DISCONNECT', clientId } as const;
          send(client, response);
        }
      });
      CLIENTS[clientId] = null;
    });
  });

  return wss;
}
