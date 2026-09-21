import { useState, type FormEvent } from "react";
import { subscribeEmail } from "@/lib/subscribers";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      await subscribeEmail({ data: { email } });
      setStatus("done");
      setMessage("You're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="max-w-xs">
      <p className="text-[11px] tracking-[0.22em] text-cream/70 uppercase">
        Get drop alerts
      </p>
      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 border-b border-cream/30 bg-transparent py-2 text-sm text-cream placeholder:text-cream/40 focus:border-cream focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          data-cursor="CLICK"
          className="shrink-0 border-b border-cream/30 py-2 text-[11px] tracking-[0.18em] text-cream uppercase hover:border-cream disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Join"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-xs ${status === "error" ? "text-red-300" : "text-cream/60"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
