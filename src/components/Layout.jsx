import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const navLinkClasses = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
    isActive
      ? 'bg-tertiary-100 text-tertiary-700 shadow-lg'
      : 'text-primary-600 hover:bg-accent-100 hover:text-primary-900'
  }`;

const Layout = ({ children }) => {
  const { user, signOutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = () => {
    closeMobileMenu();
    signOutUser();
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/games/available', label: 'Available games' },
    { to: '/games/create', label: 'Create a game' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-accent-50">
      <header className="border-b border-primary-200 bg-white backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold text-primary-900">
              Pickup Soccer
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              {navLinks.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} className={navLinkClasses}>
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? 'Profile'}
                  className="h-10 w-10 rounded-full border border-primary-300"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="text-right">
                <p className="text-sm font-semibold text-primary-900">{user?.displayName}</p>
                <p className="text-xs text-primary-600">{user?.email}</p>
              </div>
              <button
                onClick={signOutUser}
                className="rounded-md bg-white border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-accent-100 active:bg-accent-100 touch-manipulation"
              >
                Sign out
              </button>
            </div>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md border border-primary-300 p-2 text-primary-900 transition hover:bg-accent-100 active:bg-accent-100 md:hidden touch-manipulation"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
          <div
            className={`md:hidden ${
              isMobileMenuOpen
                ? 'mt-4 flex flex-col gap-4 border-t border-primary-200 pt-4'
                : 'hidden'
            }`}
            >
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={`${to}-mobile`}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${navLinkClasses({ isActive })} w-full text-left`
                  }
                  onClick={closeMobileMenu}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? 'Profile'}
                  className="h-12 w-12 rounded-full border border-primary-300"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-primary-900">{user?.displayName}</p>
                <p className="text-xs text-primary-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full rounded-md bg-white border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-accent-100 active:bg-accent-100 touch-manipulation"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6">
        {children}
      </main>
      <footer className="w-full border-t border-primary-200 bg-accent-100 py-4 text-center text-xs text-primary-600">
        <p>&copy; {new Date().getFullYear()} Amer Kovacevic All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
