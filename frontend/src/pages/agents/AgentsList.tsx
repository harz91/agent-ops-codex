const agents = [
  { name: "Support Copilot", status: "active", environment: "prod", runs: 412 },
  { name: "Sales Qualifier", status: "active", environment: "prod", runs: 301 },
  { name: "Ops Triage", status: "paused", environment: "staging", runs: 229 },
];

export default function AgentsList() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Agents</h1>
        <p className="text-sm text-slate-400">
          Manage registered agents, environments, and health status.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <p className="text-lg font-semibold">{agent.name}</p>
            <p className="text-sm text-slate-400">Env: {agent.environment}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="rounded-full border border-slate-700 px-3 py-1">
                {agent.status}
              </span>
              <span className="text-slate-400">{agent.runs} runs today</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
