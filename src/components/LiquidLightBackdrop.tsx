import type { SpeechPhase } from "../lib/useSpeech";

type Props = {
  phase: SpeechPhase;
  pulseKey: number;
};

/**
 * Joshua White 1968 liquid light show → 2026 web.
 * Three oil blobs on prime-offset loops (32s/47s/61s) with SVG turbulence
 * displacement. Plus grain overlay for warmth. Halation color tracks phase.
 */
export default function LiquidLightBackdrop({ phase, pulseKey }: Props) {
  return (
    <div className={`llb llb-${phase}`} data-pulse={pulseKey} aria-hidden>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="liquid-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="3" result="noise">
              <animate attributeName="baseFrequency" values="0.006;0.014;0.006" dur="18s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" />
          </filter>
        </defs>
      </svg>

      {/* Field — radial velvet→midnight drift */}
      <div className="llb-field" />

      {/* Blobs — the oil-and-water layer */}
      <div className="llb-blobs">
        <span className="llb-blob llb-b1" />
        <span className="llb-blob llb-b2" />
        <span className="llb-blob llb-b3" />
      </div>

      {/* Ambient phase wash — tint shifts uv → coral → citrus */}
      <div className="llb-wash" />

      {/* Film grain — static, ties it all together */}
      <div className="llb-grain" />

      <style>{`
        .llb {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .llb-field {
          position: absolute;
          inset: -10%;
          background: radial-gradient(ellipse 70% 60% at 50% 50%, #1A1040 0%, #0B0820 70%);
          animation: llb-drift 90s ease-in-out infinite;
        }
        @keyframes llb-drift {
          0%, 100% { background-position: 50% 50%; transform: scale(1); }
          33% { background-position: 40% 55%; transform: scale(1.06); }
          66% { background-position: 58% 46%; transform: scale(1.04); }
        }

        .llb-blobs {
          position: absolute;
          inset: 0;
          filter: blur(40px) url(#liquid-warp);
          mix-blend-mode: screen;
          transition: opacity 1.2s ease;
          opacity: 0.55;
        }
        @media (max-width: 640px) {
          .llb-blobs { filter: blur(24px); }
        }
        .llb-speaking .llb-blobs { opacity: 0.85; }
        .llb-delivered .llb-blobs { opacity: 0.7; }

        .llb-blob {
          position: absolute;
          width: 55vmin; height: 55vmin;
          border-radius: 62% 38% 54% 46% / 48% 61% 39% 52%;
          will-change: transform, border-radius;
        }
        .llb-b1 { background: #7A2BFF; top: -10%; left: -5%; opacity: 0.42; animation: llb-morph1 32s ease-in-out -8s infinite; }
        .llb-b2 { background: #FF5E6C; top: 30%; left: 40%; opacity: 0.34; animation: llb-morph2 47s ease-in-out -22s infinite; }
        .llb-b3 { background: #6EF7C4; top: 55%; left: -10%; opacity: 0.26; animation: llb-morph3 61s ease-in-out -40s infinite; }

        .llb-speaking .llb-b2 { background: #FF5E6C; opacity: 0.5; }
        .llb-delivered .llb-b2 { background: #FFD23F; opacity: 0.38; transition: background 1.6s ease; }
        .llb-delivered .llb-b3 { background: #6EF7C4; opacity: 0.4; }

        @keyframes llb-morph1 {
          0%, 100% { border-radius: 62% 38% 54% 46% / 48% 61% 39% 52%; transform: translate3d(0,0,0); }
          50% { border-radius: 38% 62% 46% 54% / 61% 48% 52% 39%; transform: translate3d(8vmin, 6vmin, 0); }
        }
        @keyframes llb-morph2 {
          0%, 100% { border-radius: 54% 46% 62% 38% / 52% 39% 61% 48%; transform: translate3d(0,0,0); }
          50% { border-radius: 46% 54% 38% 62% / 39% 52% 48% 61%; transform: translate3d(-10vmin, 4vmin, 0); }
        }
        @keyframes llb-morph3 {
          0%, 100% { border-radius: 48% 52% 58% 42% / 56% 44% 50% 50%; transform: translate3d(0,0,0); }
          50% { border-radius: 52% 48% 42% 58% / 44% 56% 50% 50%; transform: translate3d(6vmin, -8vmin, 0); }
        }

        .llb-wash {
          position: absolute; inset: 0;
          mix-blend-mode: soft-light;
          opacity: 0.35;
          transition: background-color 1.8s ease, opacity 1.8s ease;
        }
        .llb-ringing .llb-wash { background: #7A2BFF; opacity: 0.28; }
        .llb-speaking .llb-wash { background: #FF5E6C; opacity: 0.42; }
        .llb-delivered .llb-wash { background: #FFD23F; opacity: 0.35; }

        .llb-grain {
          position: absolute; inset: 0;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }

        /* Word-boundary pulse — extremely subtle, triggered via data-pulse key change */
        .llb-blobs {
          animation: none;
        }
        .llb[data-pulse]:not([data-pulse="0"]) .llb-blobs {
          animation: llb-pulse 400ms ease-out;
        }
        @keyframes llb-pulse {
          0% { transform: scale(1); }
          40% { transform: scale(1.008); }
          100% { transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .llb-field, .llb-blob, .llb-blobs { animation: none !important; }
          .llb-blobs { filter: blur(40px); transform: none !important; }
          .llb-wash { transition: none; }
        }
      `}</style>
    </div>
  );
}
