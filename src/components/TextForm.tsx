import { useState } from "react";
import { submitText } from "../lib/api";

const MAX = 500;

export default function TextForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await submitText({ name: name.trim() || undefined, message: message.trim(), hp });
      setStatus("ok");
      setMessage("");
      setName("");
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went sideways.");
    }
  };

  if (status === "ok") {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">📞</div>
        <h3 className="font-display text-4xl text-mint mb-2">QUEUED</h3>
        <p className="text-cream/80 max-w-md mx-auto">
          Thank you. It goes through moderation, then gets piped to a real phone.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Leave another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* honeypot */}
      <input
        type="text"
        name="hp"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        aria-hidden
      />

      <label className="block">
        <span className="label-caps block mb-2">Your name (optional)</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="a stranger"
          className="w-full bg-midnight border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-coral focus:shadow-neon transition-all"
        />
      </label>

      <label className="block">
        <span className="label-caps block mb-2">Your compliment</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
          required
          rows={5}
          placeholder="your laugh is contagious and i hope you know it"
          className="w-full bg-midnight border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-coral focus:shadow-neon transition-all resize-none"
        />
        <div className="flex justify-between mt-2 text-xs text-cream/50">
          <span>Be kind. Be specific.</span>
          <span>{message.length} / {MAX}</span>
        </div>
      </label>

      {status === "err" && (
        <div className="text-coral text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !message.trim()}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send it through"}
      </button>
    </form>
  );
}
