import { getPlayerProgress, formatStartTime } from './gameUtils.js';

const JoinedGamesList = ({ games, onLeave }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-accent-50">Your joined games</h3>
    </div>
    <ul className="space-y-3">
      {games.map((game) => {
        const { totalPlayers, maxPlayers, percentage } = getPlayerProgress(game);

        return (
          <li key={game.id} className="rounded-2xl border border-pitch-500/30 bg-secondary-700/70 p-5 shadow-lg">
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
                <div className="flex items-center gap-3 text-xs text-quaternary-400">
                  <span>Players:</span>
                  <span className="rounded-full bg-secondary-600 px-2 py-1 text-accent-50">
                    {maxPlayers ? `${totalPlayers} / ${maxPlayers}` : totalPlayers}
                  </span>
                </div>
                <button
                  onClick={() => onLeave?.(game.id)}
                  className="rounded-lg border border-pitch-500 px-3 py-1.5 text-xs font-semibold text-pitch-200 transition hover:bg-pitch-500/10 active:bg-pitch-500/10 touch-manipulation"
                >
                  Leave game
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
    {!games.length && (
      <p className="text-sm text-quaternary-400">
        You have not joined any games yet. Join one from the list to see it here.
      </p>
    )}
  </div>
);

export default JoinedGamesList;
