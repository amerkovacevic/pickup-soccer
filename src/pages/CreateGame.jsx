import { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateGameForm from '../components/games/CreateGameForm.jsx';
import { useGames } from '../hooks/useGames.js';

const CreateGamePage = () => {
  const { createGame, error } = useGames();
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateGame = async (formData) => {
    setStatus(null);
    setIsSubmitting(true);
    try {
      await createGame(formData);
      setStatus({ type: 'success', message: 'Game created successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary-900">Create a pickup game</h1>
        <p className="text-sm text-primary-700">
          Set the time, place, and roster size so your community can join in.
        </p>
        <Link
          to="/games/available"
          className="mt-2 w-fit rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-accent-100 active:bg-accent-100 touch-manipulation"
        >
          View open games
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

      <div className="rounded-2xl border border-primary-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary-900">Schedule a pickup game</h2>
            <p className="text-sm text-primary-700">Share the details so players know where to meet.</p>
          </div>
        </div>
        <CreateGameForm onSubmit={handleCreateGame} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateGamePage;
