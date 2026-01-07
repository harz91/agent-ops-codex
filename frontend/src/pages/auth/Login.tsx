export default function Login() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-400">Sign in to manage your organization.</p>
      </header>
      <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <label className="block text-sm">
          Email
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="you@company.com"
            type="email"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="••••••••"
            type="password"
          />
        </label>
        <button className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">
          Sign in
        </button>
      </form>
    </section>
  );
}
