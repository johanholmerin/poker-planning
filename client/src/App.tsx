import './App.css';
import { Average } from './Average';
import { useStore } from './hooks/store';
import { Players } from './Players';
import { Scores } from './Scores';

function App() {
  const store = useStore('ws://localhost:8080');

  return (
    <div className="app">
      <Players players={store.players} finished={store.finished} />
      <button onClick={store.updateFinished}>
        {store.finished ? 'Restart' : 'Reveal'}
      </button>
      <Average
        players={store.players}
        finished={store.finished}
        score={store.score}
      />
      <Scores
        score={store.score}
        onScore={store.updateScore}
        finished={store.finished}
      />
    </div>
  );
}

export default App;
