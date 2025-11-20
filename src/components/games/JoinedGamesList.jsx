import { getPlayerProgress, formatStartTime } from './gameUtils.js';

const JoinedGamesList = ({ games, onLeave, onDelete, currentUserId }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-primary-900">Your joined games</h3>
    </div>
    <ul className="space-y-3">
      {games.map((game) => {
        const { totalPlayers, maxPlayers, percentage } = getPlayerProgress(game);

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
                <div className="flex items-center gap-3 text-xs text-primary-600">
                  <span>Players:</span>
                  <span className="rounded-full bg-accent-100 px-2 py-1 text-primary-900">
                    {maxPlayers ? `${totalPlayers} / ${maxPlayers}` : totalPlayers}
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
                    onClick={() => onLeave?.(game.id)}
                    className="rounded-lg border border-primary-300 px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-accent-100 active:bg-accent-100 touch-manipulation"
                  >
                    Leave game
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
    {!games.length && (
      <p className="text-sm text-primary-600">
        You have not joined any games yet. Join one from the list to see it here.
      </p>
    )}
  </div>
);

export default JoinedGamesList;
