import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth.js';
import { useGames } from '../hooks/useGames.js';

const formatGameDate = (startTime) => {
  try {
    if (!startTime) return 'TBD';
    const date = startTime.toDate ? startTime.toDate() : new Date(startTime);
    return format(date, 'PPP');
  } catch (error) {
    return 'TBD';
  }
};

const formatGameTime = (startTime) => {
  try {
    if (!startTime) return 'TBD';
    const date = startTime.toDate ? startTime.toDate() : new Date(startTime);
    return format(date, 'p');
  } catch (error) {
    return 'TBD';
  }
};

const getMaxPlayers = (game) => {
  if (!game) return null;
  if (typeof game.maxPlayers === 'number') {
    return game.maxPlayers;
  }
  const parsed = Number(game.maxPlayers);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { games, availableGames, joinedGames } = useGames();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-primary-200 bg-white p-8 shadow-xl">
        <p className="text-sm uppercase tracking-wide text-primary-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-primary-900">
          {user?.displayName?.split(' ')[0] || 'Player'}, ready for your next match?
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-primary-700">
          Coordinate friendly matches, keep track of who is playing, and grow your local soccer community with just a few clicks.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-primary-600">Scheduled games</p>
            <p className="mt-2 text-3xl font-semibold text-primary-900">{games.length}</p>
            <p className="mt-1 text-xs text-primary-500">Matches on the calendar for everyone to join.</p>
            <Link to="/games/create" className="mt-4 inline-flex text-xs font-semibold text-primary-900 hover:text-primary-700 transition">
              Create a game →
            </Link>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-primary-600">Open games</p>
            <p className="mt-2 text-3xl font-semibold text-primary-900">{availableGames.length}</p>
            <p className="mt-1 text-xs text-primary-500">Matches looking for more players right now.</p>
            <Link
              to="/games/available"
              className="mt-4 inline-flex text-xs font-semibold text-primary-900 hover:text-primary-700 transition"
            >
              See all games →
            </Link>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-primary-600">Your games</p>
            <p className="mt-2 text-3xl font-semibold text-primary-900">{joinedGames.length}</p>
            <p className="mt-1 text-xs text-primary-500">You are confirmed on these upcoming fixtures.</p>
            <Link
              to="/games/available"
              className="mt-4 inline-flex text-xs font-semibold text-primary-900 hover:text-primary-700 transition"
            >
              Manage games →
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary-900">Upcoming games</h2>
          <div className="flex gap-3 text-xs font-semibold">
            <Link to="/games/available" className="text-primary-900 hover:text-primary-700 transition">
              Join a game
            </Link>
            <span className="text-primary-500">•</span>
            <Link to="/games/create" className="text-primary-900 hover:text-primary-700 transition">
              Create a game
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {joinedGames.slice(0, 2).map((game) => {
            const participantsCount = (game.participants ?? []).length;
            const maxPlayers = getMaxPlayers(game);
            const playersLabel = maxPlayers
              ? `${participantsCount} / ${maxPlayers} players`
              : `${participantsCount} player${participantsCount === 1 ? '' : 's'}`;
            const progress = maxPlayers
              ? Math.min(100, Math.round((participantsCount / maxPlayers) * 100))
              : null;

            return (
              <article
                key={game.id}
                className="rounded-2xl border border-primary-200 bg-white p-5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900">{game.title}</h3>
                    <p className="text-sm text-primary-600">{game.location}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <dt className="text-primary-600">Field</dt>
                    <dd className="font-medium text-primary-700">{game.location || 'TBD'}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-primary-600">Date</dt>
                    <dd className="font-medium text-primary-700">{formatGameDate(game.startTime)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-primary-600">Kickoff</dt>
                    <dd className="font-medium text-primary-700">{formatGameTime(game.startTime)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-primary-600">Players</dt>
                    <dd className="font-medium text-primary-700">{playersLabel}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-primary-500">Confirmed teammates keep this match on track.</p>
                {progress !== null && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-primary-600">
                      <span>Spots filled</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-primary-200">
                      <div
                        className="h-full rounded-full bg-tertiary-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {!joinedGames.length && (
            <div className="rounded-2xl border border-primary-200 bg-white p-6 text-sm text-primary-600">
              You have not joined any games yet. Hop over to the games tab to grab a spot!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
