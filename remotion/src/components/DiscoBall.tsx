import { useCurrentFrame } from "remotion";

type Props = { size?: number };

export const DiscoBall: React.FC<Props> = ({ size = 160 }) => {
  const frame = useCurrentFrame();
  const rotate = (frame * 1.5) % 360;
  return (
    <div style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <radialGradient id="dbGrad2" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FCE8C8" />
            <stop offset="40%" stopColor="#E94BD6" />
            <stop offset="100%" stopColor="#2D1B5E" />
          </radialGradient>
          <pattern id="facets2" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="url(#dbGrad2)" />
            <path d="M0 0 L8 8 M8 0 L0 8" stroke="#0B0820" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <circle cx="50" cy="50" r="44" fill="url(#facets2)" stroke="#FCE8C8" strokeWidth="1.2" />
        <circle cx="36" cy="34" r="10" fill="#FCE8C8" opacity="0.3" />
        <line x1="50" y1="6" x2="50" y2="0" stroke="#FCE8C8" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
