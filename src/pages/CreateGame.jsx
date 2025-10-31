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
        <h1 className="text-2xl font-semibold text-slate-100">Create a pickup game</h1>
        <p className="text-sm text-slate-400">
          Set the time, place, and roster size so your community can join in.
        </p>
        <Link
          to="/games/available"
          className="mt-2 w-fit rounded-md border border-pitch-500/60 px-4 py-2 text-sm font-semibold text-pitch-200 transition hover:bg-pitch-500/10"
        >
          View open games
        </Link>
      </header>

      {status && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-pitch-500/40 bg-pitch-500/10 text-pitch-200'
              : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}
        >
          {status.message}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Schedule a pickup game</h2>
            <p className="text-sm text-slate-400">Share the details so players know where to meet.</p>
          </div>
        </div>
        <CreateGameForm onSubmit={handleCreateGame} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateGamePage;
