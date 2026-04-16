type Props = { flipped?: boolean };

export default function CoiledCord({ flipped }: Props) {
  return (
    <div className="w-full overflow-hidden py-8" aria-hidden>
      <svg
        viewBox="0 0 1200 80"
        className={`w-full h-20 ${flipped ? "scale-y-[-1]" : ""}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cordGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#FF5E6C" />
            <stop offset="50%" stopColor="#E94BD6" />
            <stop offset="100%" stopColor="#FFD23F" />
          </linearGradient>
        </defs>
        <path
          d="M0 40 Q 30 0, 60 40 T 120 40 T 180 40 T 240 40 T 300 40 T 360 40 T 420 40 T 480 40 T 540 40 T 600 40 T 660 40 T 720 40 T 780 40 T 840 40 T 900 40 T 960 40 T 1020 40 T 1080 40 T 1140 40 T 1200 40"
          stroke="url(#cordGrad)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
