import { useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export function EmailPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/email_subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok && res.status !== 409) throw new Error("Failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return <p className="text-sm text-cream/80">You're on the list 🍫</p>;
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="min-h-11 flex-1 rounded-full border border-cream/20 bg-transparent px-4 text-sm text-cream placeholder:text-cream/40"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="min-h-11 rounded-full bg-cream px-5 text-sm font-semibold text-cocoa-deep disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Join"}
      </button>
      {status === "error" && (
        <p className="w-full text-xs text-red-300">Something went wrong — try again.</p>
      )}
    </form>
  );
}
