import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { adminLoginFn, adminLogoutFn, adminStatusFn } from "@/lib/admin/actions";
import { deleteSubscriber, listSubscribers, type Subscriber } from "@/lib/subscribers";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [configured, setConfigured] = useState(true);

  const refreshStatus = async () => {
    const status = await adminStatusFn();
    setSignedIn(status.signedIn);
    setConfigured(status.configured);
    setChecking(false);
  };

  useEffect(() => {
    void refreshStatus();
  }, []);

  return (
    <div className="min-h-dvh bg-cocoa-deep px-6 py-16 text-cream md:px-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em]">
          Admin
        </h1>
        {checking ? (
          <p className="mt-6 text-sm text-cream/50">Loading…</p>
        ) : !configured ? (
          <p className="mt-6 max-w-md text-sm text-cream/70">
            Set <code className="text-cream">ADMIN_EMAIL</code> and{" "}
            <code className="text-cream">ADMIN_PASSWORD</code> environment
            variables on the server (Vercel → Settings → Environment
            Variables), then redeploy, to unlock this page.
          </p>
        ) : signedIn ? (
          <Dashboard onSignedOut={() => setSignedIn(false)} />
        ) : (
          <LoginForm onSignedIn={() => setSignedIn(true)} />
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLoginFn({ data: { email, password } });
      onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 flex max-w-xs flex-col gap-3">
      <label htmlFor="admin-email" className="text-xs tracking-[0.18em] text-cream/60 uppercase">
        Admin email
      </label>
      <input
        id="admin-email"
        type="email"
        autoFocus
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-b border-cream/30 bg-transparent py-2 text-sm focus:border-cream focus:outline-none"
      />
      <label htmlFor="admin-password" className="mt-2 text-xs tracking-[0.18em] text-cream/60 uppercase">
        Admin password
      </label>
      <input
        id="admin-password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-b border-cream/30 bg-transparent py-2 text-sm focus:border-cream focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 self-start border border-cream/30 px-4 py-2 text-[11px] tracking-[0.18em] uppercase hover:border-cream disabled:opacity-50"
      >
        {loading ? "Checking…" : "Sign in"}
      </button>
      {error && (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function Dashboard({ onSignedOut }: { onSignedOut: () => void }) {
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setSubscribers(await listSubscribers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onDelete = async (id: number) => {
    setSubscribers((prev) => prev?.filter((s) => s.id !== id) ?? prev);
    await deleteSubscriber({ data: { id } }).catch(() => refresh());
  };

  const exportCsv = () => {
    if (!subscribers) return;
    const rows = [
      ["email", "subscribed_at"],
      ...subscribers.map((s) => [s.email, s.created_at]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-cream/60">
          {subscribers ? `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}` : "Loading…"}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!subscribers?.length}
            className="border border-cream/30 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase hover:border-cream disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={async () => {
              await adminLogoutFn();
              onSignedOut();
            }}
            className="border border-cream/30 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase hover:border-cream"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-cream/20 text-left text-[11px] tracking-[0.18em] text-cream/50 uppercase">
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Subscribed</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {subscribers?.map((s) => (
            <tr key={s.id} className="border-b border-cream/10">
              <td className="py-2 pr-4">{s.email}</td>
              <td className="py-2 pr-4 text-cream/50">
                {new Date(s.created_at).toLocaleString()}
              </td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  className="text-xs text-cream/50 hover:text-red-300"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subscribers?.length === 0 && (
        <p className="mt-6 text-sm text-cream/40">No subscribers yet.</p>
      )}
    </div>
  );
          }
