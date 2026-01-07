const runs = [
  { id: "run_8734", agent: "Support Copilot", status: "completed", cost: "$0.42" },
  { id: "run_8735", agent: "Sales Qualifier", status: "failed", cost: "$0.18" },
  { id: "run_8736", agent: "Ops Triage", status: "running", cost: "$0.05" },
];

export default function RunsList() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Runs</h1>
        <p className="text-sm text-slate-400">
          Track run history, costs, and performance anomalies.
        </p>
      </header>
      <div className="space-y-3">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3"
          >
            <div>
              <p className="font-medium">{run.id}</p>
              <p className="text-xs text-slate-400">Agent: {run.agent}</p>
            </div>
            <div className="text-right text-xs">
              <p className="rounded-full border border-slate-700 px-3 py-1">{run.status}</p>
              <p className="mt-2 text-slate-400">{run.cost}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
