import { useEffect, useState } from 'react';

export function useWs(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setWs(ws);

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'CONNECT' }));
    });
  }, [url]);

  return ws;
}
