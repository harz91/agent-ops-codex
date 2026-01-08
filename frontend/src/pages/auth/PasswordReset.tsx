import { FormEvent, useState } from "react";

type RequestState = {
  message: string;
  resetToken?: string;
  expiresAt?: string;
};

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [requestState, setRequestState] = useState<RequestState | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestError(null);
    setRequestState(null);
    setRequestLoading(true);

    try {
      const response = await fetch("/api/v1/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to request reset.");
      }
      setRequestState({
        message: payload?.message ?? "Check your inbox for reset instructions.",
        resetToken: payload?.data?.resetToken,
        expiresAt: payload?.data?.expiresAt,
      });
      setConfirmMessage(null);
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Unable to request reset.",
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmError(null);
    setConfirmMessage(null);
    setConfirmLoading(true);

    try {
      const response = await fetch("/api/v1/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to reset password.");
      }
      setConfirmMessage(payload?.message ?? "Password reset successful.");
      setNewPassword("");
    } catch (error) {
      setConfirmError(
        error instanceof Error ? error.message : "Unable to reset password.",
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-sm text-slate-400">
          Request a secure reset link and confirm the update to regain access.
        </p>
      </header>

      <form
        onSubmit={handleRequest}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
      >
        <div>
          <p className="text-sm font-semibold">Step 1: Request reset link</p>
          <p className="text-xs text-slate-400">
            We will email instructions if the address is registered.
          </p>
        </div>
        <label className="block text-sm">
          Email
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="you@company.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        {requestError ? (
          <p className="text-sm text-rose-300">{requestError}</p>
        ) : null}
        {requestState ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            <p>{requestState.message}</p>
            {requestState.resetToken ? (
              <p className="mt-2 break-all text-emerald-100">
                Demo token: <span className="font-semibold">{requestState.resetToken}</span>
              </p>
            ) : null}
            {requestState.expiresAt ? (
              <p className="mt-1 text-emerald-200">
                Expires at {new Date(requestState.expiresAt).toLocaleString()}.
              </p>
            ) : null}
          </div>
        ) : null}
        <button
          className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold disabled:opacity-70"
          type="submit"
          disabled={requestLoading}
        >
          {requestLoading ? "Sending..." : "Send reset email"}
        </button>
      </form>

      <form
        onSubmit={handleConfirm}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
      >
        <div>
          <p className="text-sm font-semibold">Step 2: Confirm new password</p>
          <p className="text-xs text-slate-400">
            Paste the reset token and choose a new password.
          </p>
        </div>
        <label className="block text-sm">
          Reset token
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Paste token from email"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          New password
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Create a strong password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
        {confirmError ? <p className="text-sm text-rose-300">{confirmError}</p> : null}
        {confirmMessage ? (
          <p className="text-sm text-emerald-200">{confirmMessage}</p>
        ) : null}
        <button
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-70"
          type="submit"
          disabled={confirmLoading}
        >
          {confirmLoading ? "Updating..." : "Reset password"}
        </button>
      </form>
    </section>
  );
}
