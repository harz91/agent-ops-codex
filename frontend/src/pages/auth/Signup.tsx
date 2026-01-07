export default function Signup() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-semibold">Create your org</h1>
        <p className="text-sm text-slate-400">Start monitoring your AI agents in minutes.</p>
      </header>
      <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <label className="block text-sm">
          Organization name
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="AgentOps Labs"
            type="text"
          />
        </label>
        <label className="block text-sm">
          Full name
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Alex Rivera"
            type="text"
          />
        </label>
        <label className="block text-sm">
          Work email
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="alex@company.com"
            type="email"
          />
        </label>
        <button className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">
          Create account
        </button>
      </form>
    </section>
  );
}
