import { useEffect, useRef, useState } from "react";
import DiscoBall from "./DiscoBall";
import SparkleField from "./SparkleField";

const WORDS = "COMPLIMENT".split("");

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center scanlines overflow-hidden">
      {/* Hero video (Remotion-rendered) */}
      {videoOk && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
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
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="label-caps mb-6 opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:1400ms]">
          📞 An analog art piece for a digital disco
        </div>

        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none tracking-wide text-cream chroma">
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

        <p className="mt-8 text-xl md:text-2xl text-cream/80 max-w-xl mx-auto leading-relaxed opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:1600ms]">
          Pick up the phone. Hear a compliment from a stranger. Leave one for the next person.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:1800ms]">
          <a href="#submit" className="btn-primary">
            Leave a compliment
            <span aria-hidden>→</span>
          </a>
          <a href="#how" className="btn-ghost">
            How it works
          </a>
        </div>

        {/* Floating handset */}
        <div className="mt-16 flex justify-center opacity-0 animate-[fadeIn_800ms_ease_forwards] [animation-delay:2100ms]">
          <div className="animate-ring">
            <HandsetSVG />
          </div>
        </div>
      </div>

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

function HandsetSVG() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="drop-shadow-[0_10px_40px_rgba(255,94,108,0.45)]">
      <defs>
        <linearGradient id="handsetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF5E6C" />
          <stop offset="100%" stopColor="#E94BD6" />
        </linearGradient>
      </defs>
      {/* Handset body (a classic curved receiver) */}
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
