import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RotaryPhone } from "../components/RotaryPhone";
import { Caption } from "../components/Caption";

export const CartRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera pulls back
  const scale = interpolate(frame, [0, 45], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [0, 45], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // cart slides in from left
  const cartX = interpolate(frame, [15, 55], [-600, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 8 phones stagger in
  const phones = Array.from({ length: 8 }).map((_, i) => {
    const s = spring({ frame: frame - 40 - i * 4, fps, config: { damping: 12 } });
    return { s, i };
  });

  return (
    <AbsoluteFill>
      {/* String lights */}
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 40 }}>
        <svg viewBox="0 0 1920 60" width="100%" height="60">
          <path d="M 0 20 Q 480 60, 960 30 T 1920 20" stroke="#FCE8C8" strokeWidth="1" fill="none" opacity="0.4" />
          {Array.from({ length: 14 }).map((_, i) => {
            const x = (i / 13) * 1920;
            const y = 20 + Math.sin(i / 2) * 18;
            const flick = 0.5 + 0.5 * Math.sin(frame * 0.2 + i);
            return <circle key={i} cx={x} cy={y} r="5" fill="#FFD23F" opacity={flick} />;
          })}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${cartX}px), calc(-50% + ${translateY}px)) scale(${scale})`,
          width: 1400,
        }}
      >
        {/* Wooden cart body */}
        <div
          style={{
            position: "relative",
            height: 320,
            background: "linear-gradient(180deg, #6B3E1E 0%, #3E2412 100%)",
            borderRadius: 12,
            border: "4px solid #2D1B5E",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            padding: 20,
          }}
        >
          {phones.map(({ s, i }) => (
            <div key={i} style={{ opacity: s, transform: `scale(${s})` }}>
              <RotaryPhone />
            </div>
          ))}
          {/* Wheels */}
          <div style={{ position: "absolute", bottom: -40, left: 80, width: 80, height: 80, borderRadius: "50%", background: "#0B0820", border: "4px solid #FCE8C8" }} />
          <div style={{ position: "absolute", bottom: -40, right: 80, width: 80, height: 80, borderRadius: "50%", background: "#0B0820", border: "4px solid #FCE8C8" }} />
        </div>
      </div>

      <Caption text="8 phones. 1 cart. All analog." delay={30} />
    </AbsoluteFill>
  );
};
