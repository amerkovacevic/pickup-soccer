import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useGames } from '../../hooks/useGames.js';
import { useGroups } from '../../hooks/useGroups.js';

const formatStartTime = (startTime) => {
  try {
    if (!startTime) return 'TBD';
    const date = startTime.toDate ? startTime.toDate() : new Date(startTime);
    return format(date, 'PPpp');
  } catch (error) {
    return 'TBD';
  }
};

const GamesPanel = () => {
  const { availableGames, joinedGames, loading, error, createGame, joinGame } = useGames();
  const { groups } = useGroups();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startTime: '',
    groupId: '',
  });
  const [status, setStatus] = useState(null);

  const activeGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups],
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGame = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      const group = activeGroups.find((item) => item.id === formData.groupId);
      await createGame({
        title: formData.title,
        location: formData.location,
        startTime: formData.startTime,
        groupId: formData.groupId,
        groupName: group?.name ?? 'Unknown group',
      });
      setFormData({ title: '', location: '', startTime: '', groupId: '' });
      setStatus({ type: 'success', message: 'Game created successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleJoinGame = async (gameId) => {
    setStatus(null);
    try {
      await joinGame(gameId);
      setStatus({ type: 'success', message: 'You have joined the game.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Schedule a pickup game</h2>
            <p className="text-sm text-slate-400">Pick the group, time, and location for your next match.</p>
          </div>
          {status && (
            <p
              className={`text-sm ${
                status.type === 'success' ? 'text-pitch-200' : 'text-red-400'
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
        <form onSubmit={handleCreateGame} className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label htmlFor="game-title" className="block text-sm font-medium text-slate-200">
              Title
            </label>
            <input
              id="game-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
              placeholder="Friday Night 5-a-side"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="game-location" className="block text-sm font-medium text-slate-200">
              Location
            </label>
            <input
              id="game-location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
              placeholder="Greenwood Park Turf"
              required
            />
          </div>
          <div>
            <label htmlFor="game-start" className="block text-sm font-medium text-slate-200">
              Kickoff time
            </label>
            <input
              id="game-start"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="game-group" className="block text-sm font-medium text-slate-200">
              Group
            </label>
            <select
              id="game-group"
              name="groupId"
              value={formData.groupId}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
              required
            >
              <option value="">Select a group</option>
              {activeGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-pitch-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-pitch-200"
            >
              Publish game
            </button>
          </div>
        </form>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Available games</h3>
            {loading && <span className="text-xs text-slate-400">Loading…</span>}
          </div>
          <ul className="space-y-3">
            {availableGames.map((game) => (
              <li
                key={game.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-100">{game.title}</h4>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {game.groupName}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{game.location}</p>
                  <p className="text-xs text-slate-400">Kickoff {formatStartTime(game.startTime)}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {(game.participants ?? []).map((participant) => (
                        participant.photoURL ? (
                          <img
                            key={participant.uid}
                            src={participant.photoURL}
                            alt={participant.displayName}
                            className="h-8 w-8 rounded-full border-2 border-slate-900"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span
                            key={participant.uid}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-xs text-slate-200"
                          >
                            {participant.displayName?.charAt(0) ?? '?'}
                          </span>
                        )
                      ))}
                    </div>
                    <button
                      onClick={() => handleJoinGame(game.id)}
                      className="rounded-lg bg-pitch-500 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-pitch-200"
                    >
                      Join game
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {!loading && !availableGames.length && (
            <p className="text-sm text-slate-400">
              There are no open games right now. Create one above to get people playing!
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Your joined games</h3>
          </div>
          <ul className="space-y-3">
            {joinedGames.map((game) => (
              <li
                key={game.id}
                className="rounded-2xl border border-pitch-500/30 bg-slate-900/70 p-5 shadow-lg"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-100">{game.title}</h4>
                    <span className="rounded-full bg-pitch-500/20 px-3 py-1 text-xs text-pitch-200">
                      {game.groupName}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{game.location}</p>
                  <p className="text-xs text-slate-400">Kickoff {formatStartTime(game.startTime)}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Players:</span>
                    <div className="flex flex-wrap gap-2">
                      {(game.participants ?? []).map((participant) => (
                        <span key={participant.uid} className="rounded-full bg-slate-800 px-2 py-1">
                          {participant.displayName || 'Anonymous player'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {!loading && !joinedGames.length && (
            <p className="text-sm text-slate-400">
              You have not joined any games yet. Join one from the list on the left to see it here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default GamesPanel;
