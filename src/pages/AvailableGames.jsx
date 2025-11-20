import { useState } from 'react';
import { Link } from 'react-router-dom';
import AvailableGamesList from '../components/games/AvailableGamesList.jsx';
import JoinedGamesList from '../components/games/JoinedGamesList.jsx';
import { useGames } from '../hooks/useGames.js';
import { useAuth } from '../hooks/useAuth.js';

const AvailableGamesPage = () => {
  const { user } = useAuth();
  const { games, availableGames, joinedGames, loading, error, joinGame, leaveGame, deleteGame } = useGames();
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

  const handleDeleteGame = async (gameId) => {
    // Find the game to get its title for the confirmation
    const game = games.find((g) => g.id === gameId);
    const gameTitle = game?.title || 'this game';

    if (!window.confirm(`Are you sure you want to delete "${gameTitle}"? This action cannot be undone.`)) {
      return;
    }

    setStatus(null);
    try {
      await deleteGame(gameId);
      setStatus({ type: 'success', message: 'Game has been deleted.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary-900">Games available to join</h1>
        <p className="text-sm text-primary-700">
          Browse open matches and grab your spot before the roster fills up.
        </p>
        <Link
          to="/games/create"
          className="mt-2 w-fit rounded-md bg-tertiary-100 px-4 py-2 text-sm font-semibold text-tertiary-700 transition hover:bg-tertiary-200 active:bg-tertiary-200 touch-manipulation"
        >
          Create a new game
        </Link>
      </header>

      {status && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-success-300 bg-success-100 text-success-700'
              : 'border-warning-300 bg-warning-100 text-warning-700'
          }`}
        >
          {status.message}
        </div>
      )}

      {error && <p className="text-sm text-warning-700">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <AvailableGamesList
          games={availableGames}
          loading={loading}
          onJoin={handleJoinGame}
          onDelete={handleDeleteGame}
          currentUserId={user?.uid}
        />
        <JoinedGamesList
          games={joinedGames}
          onLeave={handleLeaveGame}
          onDelete={handleDeleteGame}
          currentUserId={user?.uid}
        />
      </div>
    </div>
  );
};

export default AvailableGamesPage;
