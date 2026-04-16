import { useEffect, useRef, useState } from "react";
import DiscoBall from "./DiscoBall";
import SparkleField from "./SparkleField";
import PickUpModal from "./PickUpModal";
import { fetchRecent, type ComplimentItem } from "../lib/api";

const WORDS = "COMPLIMENT".split("");

const FALLBACK_COMPLIMENTS: ComplimentItem[] = [
  { id: -101, name: "a stranger", message: "your laugh is contagious and i hope you know it", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -102, name: null, message: "you're a good one. keep going.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -103, name: "M", message: "that jacket? a choice. and the right one.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -104, name: null, message: "you're allowed to take up space. please do.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -105, name: "phone 3", message: "whoever picks up next, i hope your day breaks open softly", has_audio: false, duration_ms: null, created_at: 0 },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [pool, setPool] = useState<ComplimentItem[]>(FALLBACK_COMPLIMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ComplimentItem | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchRecent()
      .then((data) => {
        const withMsg = data.items.filter((c) => c.message);
        if (withMsg.length > 0) setPool(withMsg);
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  const pickUp = () => {
    const c = pool[Math.floor(Math.random() * pool.length)];
    setSelected(c);
    setModalOpen(true);
  };

  const onFinished = () => {
    setModalOpen(false);
    // Small pause so the scroll feels intentional, not snapped
    window.setTimeout(() => {
      const el = document.getElementById("submit");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center scanlines overflow-hidden">
      {/* Hero video (Remotion-rendered) */}
      {videoOk && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          onError={() => setVideoOk(false)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Fallback layer — CSS sparkles + disco ball, always rendered underneath */}
      <div className="absolute inset-0 pointer-events-none">
        <SparkleField count={48} />
        <div className="absolute top-10 right-10 w-28 h-28 opacity-70">
          <DiscoBall />
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/20 to-midnight pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto py-12">
        <div className="label-caps mb-6 opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:1400ms]">
          📞 An analog art piece for a digital disco
        </div>

        <h1 className="font-display text-[clamp(2.5rem,9vw,7rem)] leading-none tracking-wide text-cream chroma whitespace-nowrap">
          {WORDS.map((ch, i) => (
            <span
              key={i}
              className="inline-block opacity-0"
              style={{
                animation: mounted ? `drop 700ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                animationDelay: `${i * 60}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-none tracking-wider text-citrus mt-2">
          HOTLINE
        </div>

        <p className="mt-6 text-lg md:text-xl text-cream/80 max-w-xl mx-auto leading-relaxed opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:1600ms]">
          Pick up the phone. Hear a compliment from a stranger. Leave one for the next person.
        </p>

        {/* THE BIG PICK-UP BUTTON */}
        <div className="mt-10 opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:2000ms]">
          <button
            onClick={pickUp}
            aria-label="Pick up the phone to hear a compliment"
            className="group relative inline-flex flex-col items-center focus:outline-none"
          >
            {/* Glow halo */}
            <div className="absolute -inset-8 rounded-full bg-coral/20 blur-2xl group-hover:bg-coral/40 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute -inset-4 rounded-full bg-magenta/20 blur-xl group-hover:bg-magenta/30 transition-all duration-500" />

            {/* Ringing handset + play button overlay */}
            <div className="relative">
              <div className="animate-ring">
                <HandsetSVG />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-cream text-midnight flex items-center justify-center shadow-glow group-hover:scale-110 group-active:scale-95 transition-transform duration-300 ring-4 ring-coral/40 animate-pulseDot">
                  <PlayIcon />
                </div>
              </div>
            </div>

            {/* Big pick-me-up call-to-action */}
            <div className="mt-8 font-display text-[clamp(1.6rem,4.5vw,3rem)] leading-tight tracking-wide text-citrus drop-shadow-[0_4px_20px_rgba(255,210,63,0.4)] max-w-3xl">
              pick up the phone<br />
              <span className="text-coral">for a pick-me-up</span>
            </div>

            <div className="mt-4 text-sm text-cream/60 uppercase tracking-[0.3em]">
              ▸ click to answer
            </div>
          </button>
        </div>

        {/* Secondary links */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:2200ms]">
          <a href="#how" className="btn-ghost text-sm">
            How it works
          </a>
          <a href="#submit" className="btn-ghost text-sm">
            Skip to leaving one
          </a>
        </div>
      </div>

      <PickUpModal open={modalOpen} compliment={selected} onClose={() => setModalOpen(false)} onFinished={onFinished} />

      <style>{`
        @keyframes drop {
          0% { transform: translateY(-40px); opacity: 0; filter: blur(8px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 4.5v15a1 1 0 0 0 1.555.832l12-7.5a1 1 0 0 0 0-1.664l-12-7.5A1 1 0 0 0 6 4.5Z" />
    </svg>
  );
}

function HandsetSVG() {
  return (
    <svg width="220" height="220" viewBox="0 0 140 140" fill="none" className="drop-shadow-[0_10px_40px_rgba(255,94,108,0.55)]">
      <defs>
        <linearGradient id="handsetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF5E6C" />
          <stop offset="100%" stopColor="#E94BD6" />
        </linearGradient>
      </defs>
      {/* Handset body */}
      <path
        d="M30 45 C30 25, 50 15, 70 25 L95 50 C115 70, 105 90, 85 100 L75 90 C65 80, 55 70, 45 60 Z"
        fill="url(#handsetGrad)"
        stroke="#FCE8C8"
        strokeWidth="2"
      />
      {/* Ear piece dots */}
      <circle cx="40" cy="40" r="3" fill="#FCE8C8" opacity="0.6" />
      <circle cx="47" cy="35" r="3" fill="#FCE8C8" opacity="0.6" />
      <circle cx="35" cy="47" r="3" fill="#FCE8C8" opacity="0.6" />
      {/* Cord */}
      <path
        d="M35 50 Q 25 60, 32 70 Q 20 78, 28 88 Q 15 96, 24 108 Q 12 116, 22 128"
        stroke="#FF5E6C"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
