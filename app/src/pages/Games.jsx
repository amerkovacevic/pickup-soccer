import GamesPanel from '../components/games/GamesPanel.jsx';

const GamesPage = () => (
  <div className="space-y-6">
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-slate-100">Games</h1>
      <p className="text-sm text-slate-400">
        Plan new pickup matches and keep track of the ones you have already joined.
      </p>
    </header>
    <GamesPanel />
  </div>
);

export default GamesPage;
