const keys = [
  { name: "Production ingest", scope: "ingest", created: "Aug 12" },
  { name: "Dashboard read", scope: "read", created: "Aug 08" },
];

export default function SettingsApiKeys() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">API keys</h1>
        <p className="text-sm text-slate-400">
          Generate keys for SDK ingestion and dashboard access.
        </p>
      </header>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Keys</p>
            <p className="text-sm text-slate-400">Rotate keys regularly for security.</p>
          </div>
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">
            Generate key
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {keys.map((key) => (
            <div
              key={key.name}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <div>
                <p className="font-medium">{key.name}</p>
                <p className="text-xs text-slate-400">
                  Scope: {key.scope} · Created {key.created}
                </p>
              </div>
              <button className="text-xs text-rose-300">Revoke</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
