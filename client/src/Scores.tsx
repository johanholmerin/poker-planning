const SCORES = [0, 1, 2, 3, 4, 5];

interface ScoresArgs {
  score: number | null;
  onScore: (score: number) => void;
  finished: boolean;
}

export function Scores({ score, onScore, finished }: ScoresArgs) {
  return (
    <div className="scores">
      {SCORES.map((buttonScore) => (
        <button
          className={buttonScore === score ? 'selected' : ''}
          disabled={finished}
          key={buttonScore}
          onClick={() => onScore(buttonScore)}
        >
          {buttonScore}
        </button>
      ))}
    </div>
  );
}
