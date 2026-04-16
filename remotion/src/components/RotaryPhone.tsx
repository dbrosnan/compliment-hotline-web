type Props = {
  receiverLift?: number; // 0..1
  receiverRotation?: number; // degrees
};

export const RotaryPhone: React.FC<Props> = ({ receiverLift = 0, receiverRotation = 0 }) => {
  const liftY = -80 * receiverLift;
  return (
    <svg viewBox="0 0 400 260" width="100%" height="100%">
      <defs>
        <linearGradient id="bodyGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FCE8C8" />
          <stop offset="100%" stopColor="#E0C79D" />
        </linearGradient>
        <linearGradient id="dialGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF5E6C" />
          <stop offset="100%" stopColor="#E94BD6" />
        </linearGradient>
      </defs>
      {/* Base */}
      <rect x="70" y="140" width="260" height="90" rx="18" fill="url(#bodyGrad)" stroke="#0B0820" strokeWidth="3" />
      {/* Dial */}
      <g transform="translate(200 185)">
        <circle r="55" fill="url(#dialGrad)" stroke="#0B0820" strokeWidth="3" />
        <circle r="18" fill="#0B0820" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={Math.cos(a) * 38} cy={Math.sin(a) * 38} r="6" fill="#0B0820" />;
        })}
      </g>
      {/* Cradle hooks */}
      <rect x="90" y="130" width="40" height="14" rx="4" fill="#0B0820" />
      <rect x="270" y="130" width="40" height="14" rx="4" fill="#0B0820" />
      {/* Receiver */}
      <g transform={`translate(200 ${80 + liftY}) rotate(${receiverRotation})`}>
        <path
          d="M-100 0 C-100 -20, -80 -30, -60 -20 L60 -20 C80 -30, 100 -20, 100 0 C100 20, 80 30, 60 20 L-60 20 C-80 30, -100 20, -100 0 Z"
          fill="url(#bodyGrad)"
          stroke="#0B0820"
          strokeWidth="3"
        />
        <circle cx="-80" cy="0" r="12" fill="#0B0820" opacity="0.7" />
        <circle cx="80" cy="0" r="12" fill="#0B0820" opacity="0.7" />
      </g>
    </svg>
  );
};
