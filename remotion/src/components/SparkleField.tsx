import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

type Props = { count?: number };

export const SparkleField: React.FC<Props> = ({ count = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: (i * 97) % 100,
        y: (i * 53) % 100,
        size: 4 + ((i * 7) % 12),
        phase: (i * 1.3) % (Math.PI * 2),
        speed: 0.3 + ((i * 11) % 7) / 10,
        hue: ["#FFD23F", "#E94BD6", "#6EF7C4", "#FCE8C8"][i % 4],
      })),
    [count]
  );

  return (
    <>
      {sparkles.map((s, i) => {
        const t = (frame / fps) * s.speed + s.phase;
        const y = s.y + Math.sin(t) * 3;
        const opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${y}%`,
              width: s.size,
              height: s.size,
              opacity,
              filter: `drop-shadow(0 0 6px ${s.hue})`,
            }}
          >
            <svg viewBox="0 0 20 20" width="100%" height="100%">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={s.hue} />
            </svg>
          </div>
        );
      })}
    </>
  );
};
