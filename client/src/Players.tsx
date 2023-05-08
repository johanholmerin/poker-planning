import { Player } from './hooks/store';

interface PlayerArgs {
  players: Player[];
  finished: boolean;
}

export function Players({ players, finished }: PlayerArgs) {
  return (
    <ul className="players">
      <li className="player">You</li>
      {players.map((player) => (
        <li className="player" key={player.clientId}>
          Player {player.clientId} - {finished ? player.score : null}
        </li>
      ))}
    </ul>
  );
}
