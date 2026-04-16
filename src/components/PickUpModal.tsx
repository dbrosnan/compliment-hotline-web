import { useEffect } from "react";
import type { ComplimentItem } from "../lib/api";
import { useSpeech } from "../lib/useSpeech";
import LiquidLightBackdrop from "./LiquidLightBackdrop";
import ComplimentText from "./ComplimentText";
import TravelingWaveform from "./TravelingWaveform";

type Props = {
  open: boolean;
  compliment: ComplimentItem | null;
  onClose: () => void;
  onFinished: () => void;
};

/**
 * The compliment-playback modal.
 *
 * Composed of four concentric layers (bottom → top):
 *   1. LiquidLightBackdrop — three oil blobs + feTurbulence displacement + grain
 *      + phase color wash (uv → coral → citrus).
 *   2. A dark-blur panel so the foreground stays readable against the blobs.
 *   3. ComplimentText — per-word ink bloom via Fraunces variable font
 *      (wght + opsz axes), driven by SpeechSynthesis boundary events.
 *   4. TravelingWaveform — 41 bars rendered in rAF, each `onboundary` injects
 *      a gaussian pulse that travels left→right as the word is spoken.
 *
 * All motion is speech-reactive via the `useSpeech` hook. Reduced-motion
 * users get static text with a highlight on the active word.
 */
export default function PickUpModal({ open, compliment, onClose, onFinished }: Props) {
  const text = compliment?.message ?? null;

  const speech = useSpeech(text, { active: open && !!text, rate: 0.95 });

  // When the delivered phase settles back to idle, trigger the parent's
  // auto-scroll to the submit section.
  useEffect(() => {
    if (open && speech.phase === "idle" && !!text) {
      // useSpeech resets to 'idle' 1.8s after `onend`. That's our cue.
      const prevPhase = (speech as unknown as { _prev?: string })._prev;
      void prevPhase;
      onFinished();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.phase]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !compliment) return null;

  const phase = speech.phase;
  const isRinging = phase === "ringing" || phase === "idle";
  const hasStarted = phase === "speaking" || phase === "paused" || phase === "delivered";
  const hasEnded = phase === "delivered";

  const phaseLabel =
    phase === "ringing" || phase === "idle"
      ? "📞 incoming..."
      : phase === "speaking" || phase === "paused"
        ? "🎙 from a stranger"
        : phase === "delivered"
          ? "💌 delivered"
          : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compliment player"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-[fadeIn_300ms_ease_forwards]"
    >
      {/* Layer 1: full-viewport liquid light backdrop */}
      <LiquidLightBackdrop phase={phase} pulseKey={speech.pulses.length} />

      {/* Close on backdrop click — sits over the backdrop layer */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute inset-0 w-full h-full cursor-default bg-midnight/30 backdrop-blur-sm"
        tabIndex={-1}
      />

      {/* Layer 2: the card */}
      <div className="relative z-10 max-w-3xl w-full">
        <div
          className={`relative rounded-3xl p-8 md:p-14 text-center modal-card modal-card-${phase}`}
          style={{
            background: "rgba(11, 8, 32, 0.55)",
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            border: "1px solid rgba(252, 232, 200, 0.12)",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-5 text-cream/60 hover:text-cream text-2xl leading-none z-10 transition-colors"
          >
            ✕
          </button>

          <div
            className="label-caps mb-6 transition-colors duration-700"
            style={{
              color: isRinging ? "rgba(122, 43, 255, 0.9)" : hasEnded ? "rgba(255, 210, 63, 0.95)" : "rgba(255, 94, 108, 0.95)",
            }}
          >
            {phaseLabel}
          </div>

          {/* RINGING — dim handset with a single slow pulse, text in ghost state */}
          {isRinging && (
            <div className="py-6 flex flex-col items-center gap-6">
              <div className="animate-ring opacity-80">
                <RingingHandset />
              </div>
              <div className="font-body text-sm tracking-[0.25em] uppercase text-cream/40">
                connecting you with a stranger
              </div>
            </div>
          )}

          {/* SPEAKING / DELIVERED — the whole point */}
          {!isRinging && text && (
            <>
              <div className="mb-10">
                <ComplimentText
                  text={text}
                  wordIndex={speech.wordIndex}
                  hasStarted={hasStarted}
                  hasEnded={hasEnded}
                />
              </div>

              <div
                className="text-magenta font-semibold transition-opacity duration-700"
                style={{ fontFamily: '"Fraunces", Georgia, serif', fontStyle: "italic", opacity: hasStarted ? 1 : 0 }}
              >
                — {compliment.name || "a stranger"}
              </div>

              <div className="mt-10 min-h-[72px] flex items-center justify-center">
                {!hasEnded ? (
                  <TravelingWaveform state={speech} />
                ) : (
                  <div className="text-citrus font-semibold animate-pulse tracking-widest uppercase text-sm">
                    ✨ now it's your turn
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .modal-card {
          transition: box-shadow 900ms ease, background 900ms ease;
          box-shadow:
            0 0 24px rgba(122, 43, 255, 0.25),
            0 0 80px rgba(122, 43, 255, 0.15),
            0 0 180px rgba(122, 43, 255, 0.08);
        }
        .modal-card-speaking, .modal-card-paused {
          box-shadow:
            0 0 30px rgba(255, 94, 108, 0.45),
            0 0 100px rgba(255, 94, 108, 0.25),
            0 0 220px rgba(233, 75, 214, 0.15);
        }
        .modal-card-delivered {
          box-shadow:
            0 0 30px rgba(255, 210, 63, 0.4),
            0 0 110px rgba(255, 210, 63, 0.22),
            0 0 220px rgba(110, 247, 196, 0.18);
        }

        /* Halation halo — conic gradient ring behind the card, slow rotation */
        .modal-card::before {
          content: "";
          position: absolute;
          inset: -28px;
          z-index: -1;
          border-radius: inherit;
          background: conic-gradient(from 0deg, #7A2BFF, #FF5E6C, #FFD23F, #6EF7C4, #7A2BFF);
          filter: blur(48px);
          opacity: 0.35;
          animation: modal-halo 45s linear infinite;
          transition: opacity 900ms ease;
        }
        .modal-card-speaking::before, .modal-card-paused::before { opacity: 0.55; }
        .modal-card-delivered::before { opacity: 0.48; }
        @keyframes modal-halo {
          to { transform: rotate(1turn); }
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-card::before { animation: none; opacity: 0.25 !important; }
          .modal-card { transition: none !important; }
        }
      `}</style>
    </div>
  );
}

function RingingHandset() {
  return (
    <svg width="96" height="96" viewBox="0 0 140 140" fill="none" aria-hidden>
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
