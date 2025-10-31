import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useGames } from '../hooks/useGames.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { games, availableGames, joinedGames } = useGames();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-wide text-pitch-200">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">
          {user?.displayName?.split(' ')[0] || 'Player'}, ready for your next match?
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Coordinate friendly matches, keep track of who is playing, and grow your local soccer community with just a few clicks.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Scheduled games</p>
            <p className="mt-2 text-3xl font-semibold text-pitch-200">{games.length}</p>
            <p className="mt-1 text-xs text-slate-500">Matches on the calendar for everyone to join.</p>
            <Link to="/games" className="mt-4 inline-flex text-xs font-semibold text-pitch-200 hover:text-pitch-100">
              Create a game →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Open games</p>
            <p className="mt-2 text-3xl font-semibold text-pitch-200">{availableGames.length}</p>
            <p className="mt-1 text-xs text-slate-500">Matches looking for more players right now.</p>
            <Link to="/games" className="mt-4 inline-flex text-xs font-semibold text-pitch-200 hover:text-pitch-100">
              See all games →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Your games</p>
            <p className="mt-2 text-3xl font-semibold text-pitch-200">{joinedGames.length}</p>
            <p className="mt-1 text-xs text-slate-500">You are confirmed on these upcoming fixtures.</p>
            <Link to="/games" className="mt-4 inline-flex text-xs font-semibold text-pitch-200 hover:text-pitch-100">
              Manage games →
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Upcoming games</h2>
          <Link to="/games" className="text-xs font-semibold text-pitch-200 hover:text-pitch-100">
            Create or join a game
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {joinedGames.slice(0, 2).map((game) => (
            <article key={game.id} className="rounded-2xl border border-pitch-500/30 bg-slate-900/70 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{game.title}</h3>
                  <p className="text-sm text-slate-400">{game.location}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {(game.participants ?? []).length} player
                {(game.participants ?? []).length === 1 ? '' : 's'} confirmed
              </p>
            </article>
          ))}
          {!joinedGames.length && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
              You have not joined any games yet. Hop over to the games tab to grab a spot!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
