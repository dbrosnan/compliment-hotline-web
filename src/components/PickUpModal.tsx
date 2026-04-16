import { useEffect, useRef, useState } from "react";
import type { ComplimentItem } from "../lib/api";

type Props = {
  open: boolean;
  compliment: ComplimentItem | null;
  onClose: () => void;
  onFinished: () => void;
};

type Phase = "ringing" | "playing" | "done";

export default function PickUpModal({ open, compliment, onClose, onFinished }: Props) {
  const [phase, setPhase] = useState<Phase>("ringing");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("ringing");
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    if (!compliment?.message) return;

    // Brief "ringing" beat before the voice starts, for theater.
    const ringTimer = window.setTimeout(() => speak(compliment.message!), 900);
    return () => {
      window.clearTimeout(ringTimer);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, compliment?.id]);

  const speak = (text: string) => {
    setPhase("playing");
    const readingDelay = Math.min(9000, Math.max(4000, text.length * 70));
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // Fallback: show text for a visible beat, then transition
      setTimeout(() => finish(), readingDelay);
      return;
    }
    // Wait for voices to load (Chrome sometimes ships them async)
    const go = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 1.05;
      u.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      // Prefer a warm, natural voice if available
      const preferred =
        voices.find((v) => /samantha|karen|victoria|moira|fiona/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith("en") && v.localService) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      if (preferred) u.voice = preferred;
      u.onend = () => finish();
      u.onerror = () => finish();
      utterRef.current = u;
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length > 0) {
      go();
    } else {
      const onVoices = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
        go();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoices);
      // Safety net
      window.setTimeout(go, 400);
    }
  };

  const finish = () => {
    setPhase("done");
    // Small delay so the user sees "delivered" before we whisk them away
    window.setTimeout(() => {
      onFinished();
    }, 900);
  };

  if (!open || !compliment) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compliment player"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-[fadeIn_300ms_ease_forwards]"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-midnight/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full card p-8 md:p-12 text-center shadow-neon">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-cream/50 hover:text-cream text-2xl leading-none"
        >
          ✕
        </button>

        <div className="label-caps mb-6">
          {phase === "ringing" ? "📞 incoming..." : phase === "playing" ? "🎙 from a stranger" : "💌 delivered"}
        </div>

        {phase === "ringing" && (
          <div className="py-12">
            <div className="inline-block animate-ring">
              <RingingHandset />
            </div>
            <div className="mt-6 text-cream/60">connecting you with a stranger...</div>
          </div>
        )}

        {(phase === "playing" || phase === "done") && (
          <>
            <blockquote className="font-display text-3xl md:text-5xl leading-tight text-cream mb-6">
              &ldquo;{compliment.message}&rdquo;
            </blockquote>
            <div className="text-magenta font-semibold">
              — {compliment.name || "a stranger"}
            </div>
            <div className="mt-10 flex justify-center items-end gap-1.5 h-16">
              {phase === "playing" ? (
                Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-mint rounded-full shadow-[0_0_8px_#6EF7C4]"
                    style={{
                      animation: `bar 0.9s ease-in-out infinite`,
                      animationDelay: `${i * 0.06}s`,
                      height: "40%",
                    }}
                  />
                ))
              ) : (
                <div className="text-citrus font-semibold animate-pulse">
                  ✨ taking you to leave one of your own...
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes bar {
          0%, 100% { height: 20%; }
          50% { height: 95%; }
        }
      `}</style>
    </div>
  );
}

function RingingHandset() {
  return (
    <svg width="120" height="120" viewBox="0 0 140 140" fill="none">
      <defs>
        <linearGradient id="handsetModalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF5E6C" />
          <stop offset="100%" stopColor="#E94BD6" />
        </linearGradient>
      </defs>
      <path
        d="M30 45 C30 25, 50 15, 70 25 L95 50 C115 70, 105 90, 85 100 L75 90 C65 80, 55 70, 45 60 Z"
        fill="url(#handsetModalGrad)"
        stroke="#FCE8C8"
        strokeWidth="2"
      />
      <circle cx="40" cy="40" r="3" fill="#FCE8C8" opacity="0.6" />
      <circle cx="47" cy="35" r="3" fill="#FCE8C8" opacity="0.6" />
      <circle cx="35" cy="47" r="3" fill="#FCE8C8" opacity="0.6" />
    </svg>
  );
}
