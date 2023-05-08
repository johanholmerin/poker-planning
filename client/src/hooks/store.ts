import { useState } from 'react';
import { Message } from '../../../shared/messages';
import { useRemoteState } from './remote-state';
import { useWs } from './ws';

export interface Player {
  clientId: number;
  score?: number;
}

export function useStore(url: string) {
  const ws = useWs(url);

  const [score, setScore] = useState<null | number>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [finished, setFinished] = useState(false);

  useRemoteState({ ws, setPlayers, setFinished, setScore });

  function send(message: Message) {
    ws?.send(JSON.stringify(message));
  }

  function updateFinished() {
    setFinished((finished) => {
      send({ type: finished ? 'RESTART' : 'FINISH' });
      return !finished;
    });
  }

  function updateScore(value: number) {
    send({ type: 'SCORE', value });
    setScore(value);
  }

  return { players, finished, score, updateScore, updateFinished };
}
