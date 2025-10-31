import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useGroups } from '../../hooks/useGroups.js';
import { usePlayers } from '../../hooks/usePlayers.js';

const GroupsPanel = () => {
  const { user } = useAuth();
  const { groups, discoverableGroups, loading, error, createGroup, joinGroup, addMemberToGroup } = useGroups();
  const { players, loading: playersLoading, error: playersError } = usePlayers();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(null);
  const [memberSelections, setMemberSelections] = useState({});

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

  const handleJoinGroup = async (groupId) => {
    setStatus(null);

    try {
      await joinGroup(groupId);
      setStatus({ type: 'success', message: 'You have joined the group.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleAddMember = async (groupId) => {
    setStatus(null);

    try {
      await addMemberToGroup(groupId, memberSelections[groupId]);
      setStatus({ type: 'success', message: 'Player added to the group.' });
      setMemberSelections((current) => ({ ...current, [groupId]: '' }));
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <section className="space-y-6">
      {status && (
        <div
          className={`rounded-xl border px-4 py-2 text-sm ${
            status.type === 'success'
              ? 'border-pitch-500/40 bg-pitch-500/10 text-pitch-200'
              : 'border-red-500/30 bg-red-500/10 text-red-200'
          }`}
        >
          {status.message}
        </div>
      )}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-100">Create a new group</h2>
        <p className="mt-1 text-sm text-slate-400">
          Groups help you manage your friends, coworkers, or league teammates.
        </p>
        {!user && (
          <p className="mt-4 text-sm text-slate-400">
            Sign in to create and join groups. You will be prompted to sign in when you try to take an action.
          </p>
        )}
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
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={!user}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 transition ${
                user
                  ? 'bg-pitch-500 hover:bg-pitch-200'
                  : 'cursor-not-allowed bg-slate-700 text-slate-400'
              }`}
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
          {groups.map((group) => {
            const isOwner = group.ownerId === user?.uid;
            let ownerControls = null;

            if (isOwner) {
              const availablePlayers = players.filter(
                (player) => player.id !== user?.uid && !(group.members ?? []).includes(player.id),
              );

              ownerControls = (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-slate-200">Add a player</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Select a signed-in player to add them to this group.
                  </p>
                  {playersLoading && (
                    <p className="mt-2 text-xs text-slate-400">Loading players…</p>
                  )}
                  {playersError && <p className="mt-2 text-xs text-red-400">{playersError}</p>}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label htmlFor={`add-member-${group.id}`} className="sr-only">
                      Player to add
                    </label>
                    <select
                      id={`add-member-${group.id}`}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-pitch-500 focus:outline-none"
                      value={memberSelections[group.id] ?? ''}
                      onChange={(event) =>
                        setMemberSelections((current) => ({ ...current, [group.id]: event.target.value }))
                      }
                      disabled={playersLoading || !availablePlayers.length}
                    >
                      <option value="">Select a player</option>
                      {availablePlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.displayName || 'Unnamed player'} {player.email ? `(${player.email})` : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddMember(group.id)}
                      disabled={
                        playersLoading || !availablePlayers.length || !memberSelections[group.id] || !user
                      }
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        playersLoading || !availablePlayers.length || !memberSelections[group.id] || !user
                          ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                          : 'bg-pitch-500 text-slate-900 hover:bg-pitch-200'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                  {!availablePlayers.length && !playersLoading && !playersError && (
                    <p className="mt-2 text-xs text-slate-500">
                      Everyone who has signed in is already part of this group.
                    </p>
                  )}
                </div>
              );
            }

            return (
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
                {ownerControls}
              </li>
            );
          })}
        </ul>
        {!loading && !groups.length && (
          <p className="text-sm text-slate-400">
            {user
              ? 'You have not joined any groups yet. Create one above or join an existing community.'
              : 'Sign in to view the groups you belong to.'}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Groups you can join</h3>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {discoverableGroups.map((group) => (
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
                  {group.members?.length ?? 0} members
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <p>Created by {group.ownerName || 'Unknown'}</p>
                <button
                  type="button"
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={!user}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                    user
                      ? 'bg-pitch-500 text-slate-900 hover:bg-pitch-200'
                      : 'cursor-not-allowed bg-slate-700 text-slate-400'
                  }`}
                >
                  Join group
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!loading && !discoverableGroups.length && (
          <p className="text-sm text-slate-400">
            {user
              ? 'You are already part of every available group.'
              : 'Sign in to discover groups you can join.'}
          </p>
        )}
      </div>
    </section>
  );
};

export default GroupsPanel;
