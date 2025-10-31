import GroupsPanel from '../components/groups/GroupsPanel.jsx';

const GroupsPage = () => (
  <div className="space-y-6">
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-slate-100">Groups</h1>
      <p className="text-sm text-slate-400">
        Organize players into squads and neighborhoods to keep everyone in sync.
      </p>
    </header>
    <GroupsPanel />
  </div>
);

export default GroupsPage;
