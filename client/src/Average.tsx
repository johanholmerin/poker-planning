import { Player } from './hooks/store';

interface AverageArgs {
  players: Player[];
  finished: boolean;
  score: number | null;
}

export function Average({ players, finished, score }: AverageArgs) {
  const scores = [score, ...players.map((player) => player.score)].filter(
    (score) => typeof score === 'number'
  ) as number[];
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;

  return (
    <div style={{ visibility: finished ? 'visible' : 'hidden' }}>
      Average: {average}
    </div>
  );
}
