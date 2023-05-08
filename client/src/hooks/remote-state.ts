import { Dispatch, useEffect, SetStateAction } from 'react';
import { ClientMessage } from '../../../shared/messages';
import { Player } from './store';

interface RemoteStateArgs {
  ws: WebSocket | null;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setFinished: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number | null>>;
}

export function useRemoteState({
  ws,
  setPlayers,
  setFinished,
  setScore,
}: RemoteStateArgs) {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const message = JSON.parse(event.data) as ClientMessage;
      switch (message.type) {
        case 'CONNECT': {
          const newPlayer = { clientId: message.clientId };
          setPlayers((players) => {
            return [...players, newPlayer];
          });
          break;
        }
        case 'DISCONNECT': {
          setPlayers((players) =>
            players.filter((player) => player.clientId !== message.clientId)
          );
          break;
        }
        case 'SCORE': {
          setPlayers((players) =>
            players.map((player) => {
              if (player.clientId === message.clientId) {
                return { ...player, score: message.value };
              }

              return player;
            })
          );
          break;
        }
        case 'FINISH': {
          setFinished(true);
          break;
        }
        case 'RESTART': {
          setFinished(false);
          setScore(null);
          break;
        }
      }
    }
    ws?.addEventListener('message', onMessage);

    return () => ws?.removeEventListener('message', onMessage);
  }, [ws, setFinished, setPlayers, setScore]);
}
