import { useState } from 'react';
import { Link } from 'react-router-dom';
import AvailableGamesList from '../components/games/AvailableGamesList.jsx';
import JoinedGamesList from '../components/games/JoinedGamesList.jsx';
import { useGames } from '../hooks/useGames.js';

const AvailableGamesPage = () => {
  const { availableGames, joinedGames, loading, error, joinGame, leaveGame } = useGames();
  const [status, setStatus] = useState(null);

  const handleJoinGame = async (gameId) => {
    setStatus(null);
    try {
      await joinGame(gameId);
      setStatus({ type: 'success', message: 'You have joined the game.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleLeaveGame = async (gameId) => {
    setStatus(null);
    try {
      await leaveGame(gameId);
      setStatus({ type: 'success', message: 'You have left the game.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-accent-50">Games available to join</h1>
        <p className="text-sm text-quaternary-400">
          Browse open matches and grab your spot before the roster fills up.
        </p>
        <Link
          to="/games/create"
          className="mt-2 w-fit rounded-md bg-pitch-500 px-4 py-2 text-sm font-semibold text-primary-800 transition hover:bg-pitch-400 active:bg-pitch-400 touch-manipulation"
        >
          Create a new game
        </Link>
      </header>

      {status && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-success-500/40 bg-success-500/10 text-success-300'
              : 'border-warning-500/40 bg-warning-500/10 text-warning-300'
          }`}
        >
          {status.message}
        </div>
      )}

      {error && <p className="text-sm text-warning-400">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <AvailableGamesList games={availableGames} loading={loading} onJoin={handleJoinGame} />
        <JoinedGamesList games={joinedGames} onLeave={handleLeaveGame} />
      </div>
    </div>
  );
};

export default AvailableGamesPage;
