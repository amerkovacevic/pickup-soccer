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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_45%),_radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_40%)]" />
      <div className="relative w-full max-w-lg">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-100/5 via-slate-100/5 to-slate-100/10 p-[1px] shadow-[0_25px_50px_-12px_rgba(15,23,42,0.75)]">
          <div className="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-slate-950/90 px-10 py-12 backdrop-blur">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">Pickup Soccer</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Matchday HQ</h1>
              <p className="mt-3 text-base leading-relaxed text-slate-400">
                Coordinate friendly fixtures, manage squads, and keep your crew in the loop without missing a kickoff.
              </p>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
              Continue with Google
            </button>

            {error && <p className="mt-6 text-center text-sm text-rose-400">{error}</p>}
            <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
              By continuing you agree to share your name and email so captains can invite you to fixtures and manage rosters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
