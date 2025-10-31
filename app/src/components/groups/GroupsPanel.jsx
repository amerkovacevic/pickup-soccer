import { useState } from 'react';
import { useGroups } from '../../hooks/useGroups.js';

const GroupsPanel = () => {
  const { groups, loading, error, createGroup } = useGroups();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus({ type: 'error', message: 'Group name is required.' });
      return;
    }

    try {
      await createGroup({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      setStatus({ type: 'success', message: 'Group created successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-100">Create a new group</h2>
        <p className="mt-1 text-sm text-slate-400">
          Groups help you manage your friends, coworkers, or league teammates.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label htmlFor="group-name" className="block text-sm font-medium text-slate-200">
              Group name
            </label>
            <input
              id="group-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
              placeholder="Downtown Futbol Club"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="group-description" className="block text-sm font-medium text-slate-200">
              Description
            </label>
            <textarea
              id="group-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
              placeholder="Casual 7v7 games on Wednesday nights"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            {status && (
              <p
                className={`text-sm ${
                  status.type === 'success' ? 'text-pitch-200' : 'text-red-400'
                }`}
              >
                {status.message}
              </p>
            )}
            <button
              type="submit"
              className="rounded-lg bg-pitch-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-pitch-200"
            >
              Save group
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Your groups</h3>
          {loading && <span className="text-xs text-slate-400">Loading groups…</span>}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <ul className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <li
              key={group.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">{group.name}</h4>
                  <p className="mt-1 text-sm text-slate-400">{group.description || 'No description yet.'}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {group.members?.length ?? 1} members
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Created by {group.ownerName || 'Unknown'}
              </p>
            </li>
          ))}
        </ul>
        {!loading && !groups.length && (
          <p className="text-sm text-slate-400">
            You have not created any groups yet. Start by creating one above.
          </p>
        )}
      </div>
    </section>
  );
};

export default GroupsPanel;
