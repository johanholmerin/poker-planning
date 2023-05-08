import assert from 'assert';
import { WebSocket } from 'ws';
import { createServer } from './server';

function createTestServer() {
  const server = createServer({ port: 0 });
  const address = server.address();
  // Narrow type, is only a string when listening to a pipe
  assert(typeof address !== 'string');
  const url = `ws://localhost:${address.port}`;
  return { url, server };
}

function createClient(url: string) {
  const client = new WebSocket(url);
  return new Promise<WebSocket>((res) =>
    client.once('open', () => res(client))
  );
}

function onMessage(client: WebSocket) {
  return new Promise<unknown>((res) =>
    client.once('message', (data) => {
      res(JSON.parse(data.toString()));
    })
  );
}

it('should connect to client', async () => {
  const { url, server } = createTestServer();
  const client = await createClient(url);

  server.close();
  client.close();
});

it('should log error on invalid message', async () => {
  const { url, server } = createTestServer();
  const client1 = await createClient(url);

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  client1.send(JSON.stringify({ test: 1 }));

  client1.close();
  await new Promise((res) => server.close(res));

  expect(spy).toHaveBeenCalled();
});

it('should send connect messages to other clients', async () => {
  const { url, server } = createTestServer();
  const client1 = await createClient(url);
  const client2 = await createClient(url);

  client2.send(JSON.stringify({ type: 'CONNECT' }));
  const response = await onMessage(client1);
  expect(response).toEqual({ type: 'CONNECT', clientId: 1 });

  server.close();
  client1.close();
  client2.close();
});

it('should send disconnect messages to other clients', async () => {
  const { url, server } = createTestServer();
  const client1 = await createClient(url);
  const client2 = await createClient(url);

  client2.close();
  const response = await onMessage(client1);
  expect(response).toEqual({ type: 'DISCONNECT', clientId: 1 });

  server.close();
  client1.close();
  client2.close();
});

it('should send score messages to other clients', async () => {
  const { url, server } = createTestServer();
  const client1 = await createClient(url);
  const client2 = await createClient(url);

  client2.send(JSON.stringify({ type: 'SCORE', value: 3 }));
  const response = await onMessage(client1);
  expect(response).toEqual({ type: 'SCORE', value: 3, clientId: 1 });

  server.close();
  client1.close();
  client2.close();
});

it('should send finish messages to other clients', async () => {
  const { url, server } = createTestServer();
  const client1 = await createClient(url);
  const client2 = await createClient(url);

  client2.send(JSON.stringify({ type: 'FINISH' }));
  const response = await onMessage(client1);
  expect(response).toEqual({ type: 'FINISH', clientId: 1 });

  server.close();
  client1.close();
  client2.close();
});

it('should send restart messages to other clients', async () => {
  const { url, server } = createTestServer();
  const client1 = await createClient(url);
  const client2 = await createClient(url);

  client2.send(JSON.stringify({ type: 'RESTART' }));
  const response = await onMessage(client1);
  expect(response).toEqual({ type: 'RESTART', clientId: 1 });

  server.close();
  client1.close();
  client2.close();
});
