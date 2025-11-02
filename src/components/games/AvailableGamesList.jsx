import { getPlayerProgress, formatStartTime } from './gameUtils.js';

const AvailableGamesList = ({ games, loading, onJoin }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-accent-50">Available games</h3>
      {loading && <span className="text-xs text-quaternary-400">Loading…</span>}
    </div>
    <ul className="space-y-3">
      {games.map((game) => {
        const { totalPlayers, maxPlayers, percentage } = getPlayerProgress(game);
        const isFull = maxPlayers ? totalPlayers >= maxPlayers : false;

        return (
          <li key={game.id} className="rounded-2xl border border-tertiary-500/30 bg-secondary-700/60 p-5 shadow-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-accent-50">{game.title}</h4>
              </div>
              <p className="text-sm text-quaternary-300">{game.location}</p>
              <p className="text-xs text-quaternary-400">Kickoff {formatStartTime(game.startTime)}</p>
              {game.createdByName && (
                <p className="text-xs text-quaternary-500">Hosted by {game.createdByName}</p>
              )}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {(game.participants ?? []).map((participant) =>
                      participant.photoURL ? (
                        <img
                          key={participant.uid}
                          src={participant.photoURL}
                          alt={participant.displayName}
                          className="h-8 w-8 rounded-full border-2 border-secondary-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span
                          key={participant.uid}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-secondary-700 bg-secondary-600 text-xs text-accent-50"
                        >
                          {participant.displayName?.charAt(0) ?? '?'}
                        </span>
                      ),
                    )}
                  </div>
                  <span className="text-xs text-quaternary-400">
                    {maxPlayers ? `${totalPlayers} / ${maxPlayers} players` : `${totalPlayers} player${
                      totalPlayers === 1 ? '' : 's'
                    }`}
                  </span>
                </div>
                <button
                  onClick={() => onJoin?.(game.id)}
                  disabled={isFull}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition touch-manipulation active:scale-95 ${
                    isFull
                      ? 'cursor-not-allowed bg-secondary-600 text-quaternary-500'
                      : 'bg-pitch-500 text-accent-50 hover:bg-pitch-400 active:bg-pitch-400'
                  }`}
                >
                  {isFull ? 'Game full' : 'Join game'}
                </button>
              </div>
              {maxPlayers && percentage !== null && (
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-quaternary-400">
                    <span>Spots filled</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary-600">
                    <div className="h-full rounded-full bg-pitch-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
    {!loading && !games.length && (
      <p className="text-sm text-quaternary-400">
        There are no open games right now. Create one to get people playing!
      </p>
    )}
  </div>
);

export default AvailableGamesList;
