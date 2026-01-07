const members = [
  { name: "Alex Rivera", role: "Admin", team: "Platform" },
  { name: "Priya Shah", role: "TeamLead", team: "Finance" },
  { name: "Diego Morales", role: "Member", team: "Support" },
];

export default function SettingsMembers() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Team members</h1>
        <p className="text-sm text-slate-400">
          Invite teammates and assign roles for approvals and run oversight.
        </p>
      </header>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Invite member</p>
            <p className="text-sm text-slate-400">Assign a role and team.</p>
          </div>
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">
            Send invite
          </button>
        </div>
        <div className="mt-6 grid gap-3">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-slate-400">{member.team}</p>
              </div>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
