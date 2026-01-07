const stats = [
  { label: "Active agents", value: "12" },
  { label: "Runs today", value: "1,284" },
  { label: "Spend this week", value: "$842" },
  { label: "Alerts", value: "2" },
];

const topAgents = [
  { name: "Support Copilot", runs: "412", errorRate: "0.8%" },
  { name: "Sales Qualifier", runs: "301", errorRate: "1.4%" },
  { name: "Ops Triage", runs: "229", errorRate: "0.3%" },
];

export default function DashboardHome() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-slate-400">
          Monitor spend, approvals, and live run activity across every agent in your org.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold">Live run activity</h2>
          <p className="mt-1 text-sm text-slate-400">
            Streaming updates will appear here via SSE or WebSockets.
          </p>
          <div className="mt-6 space-y-4">
            {topAgents.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-xs text-slate-400">Runs today: {agent.runs}</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  Error rate {agent.errorRate}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold">Approval queue</h2>
          <p className="mt-1 text-sm text-slate-400">
            4 actions pending review in Finance and Security.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="font-medium">Approve $2,000 monthly budget</p>
              <p className="text-xs text-slate-400">Agent: Sales Qualifier</p>
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="font-medium">Allow external data export</p>
              <p className="text-xs text-slate-400">Agent: Ops Triage</p>
            </li>
          </ul>
          <button className="mt-6 w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
            Review approvals
          </button>
        </div>
      </div>
    </section>
  );
}
