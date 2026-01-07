const plans = ["Starter", "Growth", "Enterprise"];

export default function SettingsOrg() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Organization settings</h1>
        <p className="text-sm text-slate-400">
          Update your organization profile and billing plan.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              Org name
              <input
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                defaultValue="AgentOps Labs"
              />
            </label>
            <label className="block text-sm">
              Logo URL
              <input
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </label>
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">
              Save changes
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold">Plan</h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose the plan that matches your monitoring needs.
          </p>
          <div className="mt-4 space-y-3">
            {plans.map((plan) => (
              <label
                key={plan}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm"
              >
                <span>{plan}</span>
                <input type="radio" name="plan" defaultChecked={plan === "Growth"} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
