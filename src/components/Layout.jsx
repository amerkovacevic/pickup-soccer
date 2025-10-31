import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const navLinkClasses = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
    isActive
      ? 'bg-pitch-500 text-slate-900 shadow-lg'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

const Layout = ({ children }) => {
  const { user, signOutUser } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-pitch-200">
            Pickup Soccer
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={navLinkClasses} end>
              Dashboard
            </NavLink>
            <NavLink to="/games/available" className={navLinkClasses}>
              Available games
            </NavLink>
            <NavLink to="/games/create" className={navLinkClasses}>
              Create a game
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Profile'}
                className="h-10 w-10 rounded-full border border-slate-700"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-100">{user?.displayName}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={signOutUser}
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/80 py-4 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Amer Kovacevic All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
