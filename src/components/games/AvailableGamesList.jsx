import { getPlayerProgress, formatStartTime } from './gameUtils.js';

const AvailableGamesList = ({ games, loading, onJoin, onDelete, currentUserId }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-primary-900">Available games</h3>
      {loading && <span className="text-xs text-primary-600">Loading…</span>}
    </div>
    <ul className="space-y-3">
      {games.map((game) => {
        const { totalPlayers, maxPlayers, percentage } = getPlayerProgress(game);
        const isFull = maxPlayers ? totalPlayers >= maxPlayers : false;

        return (
          <li key={game.id} className="rounded-2xl border border-primary-200 bg-white p-5 shadow-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-primary-900">{game.title}</h4>
              </div>
              <p className="text-sm text-primary-700">{game.location}</p>
              <p className="text-xs text-primary-600">Kickoff {formatStartTime(game.startTime)}</p>
              {game.createdByName && (
                <p className="text-xs text-primary-500">Hosted by {game.createdByName}</p>
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
                          className="h-8 w-8 rounded-full border-2 border-white"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span
                          key={participant.uid}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-200 text-xs text-primary-900"
                        >
                          {participant.displayName?.charAt(0) ?? '?'}
                        </span>
                      ),
                    )}
                  </div>
                  <span className="text-xs text-primary-600">
                    {maxPlayers ? `${totalPlayers} / ${maxPlayers} players` : `${totalPlayers} player${
                      totalPlayers === 1 ? '' : 's'
                    }`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {currentUserId && game.createdBy === currentUserId && (
                    <button
                      onClick={() => onDelete?.(game.id)}
                      className="rounded-lg border border-error-300 px-3 py-1.5 text-xs font-semibold text-error-700 transition hover:bg-error-100 active:bg-error-100 touch-manipulation"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => onJoin?.(game.id)}
                    disabled={isFull}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition touch-manipulation active:scale-95 ${
                      isFull
                        ? 'cursor-not-allowed bg-primary-200 text-primary-500'
                        : 'bg-tertiary-100 text-tertiary-700 hover:bg-tertiary-200 active:bg-tertiary-200'
                    }`}
                  >
                    {isFull ? 'Game full' : 'Join game'}
                  </button>
                </div>
              </div>
              {maxPlayers && percentage !== null && (
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-primary-600">
                    <span>Spots filled</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-primary-200">
                    <div className="h-full rounded-full bg-tertiary-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
    {!loading && !games.length && (
      <p className="text-sm text-primary-600">
        There are no open games right now. Create one to get people playing!
      </p>
    )}
  </div>
);

export default AvailableGamesList;
