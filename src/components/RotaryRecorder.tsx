import { useEffect, useRef, useState } from "react";
import { initAudio, finalizeAudio } from "../lib/api";

const MAX_DURATION_MS = 30_000;

type State = "idle" | "recording" | "review" | "uploading" | "done" | "error";

export default function RotaryRecorder() {
  const [state, setState] = useState<State>("idle");
  const [name, setName] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickMime = () => {
    // Prefer mp4/aac so the resulting blob plays on iOS Safari without
    // transcoding. Fall back to webm/opus for browsers that lack mp4
    // MediaRecorder support (older desktop Chrome).
    const candidates = [
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
    for (const m of candidates) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) return m;
    }
    return "audio/webm";
  };

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMime();
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: mimeType });
        setBlob(b);
        setAudioUrl(URL.createObjectURL(b));
        setState("review");
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      startRef.current = Date.now();
      setElapsed(0);
      setState("recording");
      timerRef.current = window.setInterval(() => {
        const ms = Date.now() - startRef.current;
        setElapsed(ms);
        if (ms >= MAX_DURATION_MS) stop();
      }, 100);
    } catch (err) {
      setError("Microphone access was denied. Check your browser settings.");
      setState("error");
    }
  };

  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRef.current?.stop();
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setBlob(null);
    setAudioUrl(null);
    setElapsed(0);
    setError("");
    setState("idle");
  };

  const upload = async () => {
    if (!blob) return;
    setState("uploading");
    try {
      const mimeType = blob.type || "audio/webm";
      const { id, put_url } = await initAudio({
        name: name.trim() || undefined,
        duration_ms: elapsed,
        mime_type: mimeType,
      });

      const putRes = await fetch(put_url, {
        method: "PUT",
        headers: { "Content-Type": mimeType },
        body: blob,
      });
      if (!putRes.ok) throw new Error(`Upload failed (${putRes.status})`);

      await finalizeAudio({ id });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">🎙</div>
        <h3 className="font-display text-4xl text-mint mb-2">SENT</h3>
        <p className="text-cream/80">Queued for moderation. It'll play on a real landline soon.</p>
        <button onClick={reset} className="btn-ghost mt-6">
          Record another
        </button>
      </div>
    );
  }

  const seconds = Math.floor(elapsed / 1000);
  const pct = Math.min(100, (elapsed / MAX_DURATION_MS) * 100);

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="label-caps block mb-2">Your name (optional)</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          disabled={state === "recording" || state === "uploading"}
          placeholder="a stranger"
          className="w-full bg-midnight border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-coral transition-all"
        />
      </label>

      <div className="flex flex-col items-center gap-4 py-6">
        <RotaryDial state={state} onClick={state === "idle" ? start : state === "recording" ? stop : undefined} />

        <div className="font-display text-4xl text-citrus tabular-nums">
          {String(seconds).padStart(2, "0")}<span className="text-cream/40">s</span>
          <span className="text-cream/30 text-lg"> / 30s</span>
        </div>

        {state === "recording" && (
          <div className="w-full max-w-xs h-1 bg-midnight rounded-full overflow-hidden">
            <div className="h-full bg-coral transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}

        {state === "idle" && (
          <div className="text-sm text-cream/60">Click the dial to start recording</div>
        )}
        {state === "recording" && (
          <div className="text-sm text-coral flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-coral animate-pulseDot" />
            Recording — click dial to stop
          </div>
        )}
      </div>

      {state === "review" && audioUrl && (
        <div className="space-y-4">
          <audio src={audioUrl} controls className="w-full" />
          <div className="flex gap-3">
            <button onClick={reset} className="btn-ghost flex-1">
              Redo
            </button>
            <button onClick={upload} className="btn-primary flex-1 justify-center">
              Send it through
            </button>
          </div>
        </div>
      )}

      {state === "uploading" && (
        <div className="text-center text-cream/70">Uploading...</div>
      )}

      {error && <div className="text-coral text-sm text-center">{error}</div>}
    </div>
  );
}

function RotaryDial({
  state,
  onClick,
}: {
  state: State;
  onClick?: () => void;
}) {
  const active = state === "recording";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative w-48 h-48 rounded-full transition-transform ${
        onClick ? "hover:scale-105 active:scale-95 cursor-pointer" : "cursor-default"
      }`}
      aria-label={state === "idle" ? "Start recording" : state === "recording" ? "Stop recording" : "Dial"}
    >
      <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-[0_0_30px_rgba(233,75,214,0.35)] ${active ? "animate-spin12" : ""}`}>
        <defs>
          <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FCE8C8" />
            <stop offset="60%" stopColor="#FF5E6C" />
            <stop offset="100%" stopColor="#E94BD6" />
          </radialGradient>
        </defs>
        {/* outer dial */}
        <circle cx="100" cy="100" r="90" fill="url(#dialGrad)" stroke="#FCE8C8" strokeWidth="3" />
        {/* finger holes */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
          const r = 65;
          const x = 100 + Math.cos(angle) * r;
          const y = 100 + Math.sin(angle) * r;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="11" fill="#0B0820" />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#FCE8C8"
                fontSize="11"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="700"
              >
                {(i + 1) % 10}
              </text>
            </g>
          );
        })}
        {/* center */}
        <circle cx="100" cy="100" r="22" fill="#0B0820" stroke="#FCE8C8" strokeWidth="2" />
        <circle cx="100" cy="100" r="10" fill={active ? "#FF5E6C" : "#6EF7C4"} className={active ? "animate-pulseDot" : ""} />
      </svg>
    </button>
  );
}
