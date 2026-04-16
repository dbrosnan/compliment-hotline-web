import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DiscoBall } from "../components/DiscoBall";

const LINE1 = "COMPLIMENT".split("");
const LINE2 = "HOTLINE".split("");

export const LogoCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hue = (frame * 1.5) % 360;

  return (
    <AbsoluteFill
      style={{
        background: `conic-gradient(from ${hue}deg at 50% 50%, #FF5E6C, #FFD23F, #6EF7C4, #E94BD6, #FF5E6C)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(11, 8, 32, 0.65)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          fontFamily: "Monoton, cursive",
          color: "#FCE8C8",
        }}
      >
        <div style={{ fontSize: 180, letterSpacing: 6, display: "flex" }}>
          {LINE1.map((c, i) => {
            const s = spring({ frame: frame - i * 2, fps, config: { damping: 10 } });
            const y = interpolate(s, [0, 1], [-60, 0]);
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: s }}>
                {c}
              </span>
            );
          })}
        </div>

        <div style={{ fontSize: 140, letterSpacing: 10, display: "flex", alignItems: "center", gap: 10 }}>
          {LINE2.map((c, i) => {
            const s = spring({ frame: frame - 20 - i * 2, fps, config: { damping: 10 } });
            const y = interpolate(s, [0, 1], [-60, 0]);
            if (c === "O") {
              return (
                <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: s, width: 120, height: 120, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <DiscoBall size={120} />
                  </div>
                </span>
              );
            }
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: s }}>
                {c}
              </span>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 44,
            fontWeight: 600,
            color: "#FFD23F",
            letterSpacing: 2,
            opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          find the cart. say something kind.
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 32,
            color: "#FCE8C8",
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          complimenthotline.org
        </div>
      </div>
    </AbsoluteFill>
  );
};
