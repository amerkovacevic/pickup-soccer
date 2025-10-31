import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const { user, signInWithGoogle, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
        <div className="w-full max-w-lg space-y-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-10 text-center shadow-2xl shadow-emerald-500/10 backdrop-blur">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Pickup Soccer</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Matchday HQ</h1>
            <p className="text-base text-slate-400">
              Coordinate friendly fixtures, manage squads, and keep your crew in the loop without missing a kickoff.
            </p>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-emerald-400/90 px-6 py-3 text-lg font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span>Continue with Google</span>
            <svg className="h-6 w-6" viewBox="0 0 533.5 544.3" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272v104.8h146.9c-6.3 34-25 62.8-53.6 82.1v68.2h86.4c50.7-46.7 81.8-115.5 81.8-199.8z"
              />
              <path
                fill="#34A853"
                d="M272 544.3c72.6 0 133.6-23.9 178.1-64.1l-86.4-68.2c-24 16.2-54.7 25.6-91.7 25.6-70.5 0-130.3-47.6-151.7-111.5H29v69.9C73.8 488.9 165.7 544.3 272 544.3z"
              />
              <path
                fill="#FBBC05"
                d="M120.3 325.9c-10.4-31.1-10.4-64.8 0-95.9V160h-91.3C10.3 204.4 0 247.6 0 292.2s10.3 87.8 29 132.2l91.3-69.9z"
              />
              <path
                fill="#EA4335"
                d="M272 107.7c39.4-.6 77.4 14 106.2 40.9l79.2-79.2C405.8 24 345.7 0 272 0 165.7 0 73.8 55.4 29 139.9l91.3 69.9C141.7 155.3 201.5 107.7 272 107.7z"
              />
            </svg>
            </button>

            {error && <p className="mt-6 text-center text-sm text-rose-400">{error}</p>}
            <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
              By continuing you agree to share your name and email so captains can invite you to fixtures and manage rosters.
            </p>
          </div>
      </div>
    </div>
  );
};

export default Login;
