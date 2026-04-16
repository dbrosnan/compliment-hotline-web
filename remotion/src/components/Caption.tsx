import { useCurrentFrame, interpolate } from "remotion";

type Props = { text: string; delay?: number };

export const Caption: React.FC<Props> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  const per = 2; // frames per character
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 100,
        textAlign: "center",
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: 56,
        fontWeight: 600,
        color: "#FCE8C8",
        textShadow: "0 6px 24px rgba(0,0,0,0.8)",
        letterSpacing: "0.02em",
      }}
    >
      {chars.map((c, i) => {
        const enter = delay + i * per;
        const opacity = interpolate(frame, [enter, enter + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [enter, enter + 10], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span key={i} style={{ display: "inline-block", opacity, transform: `translateY(${y}px)` }}>
            {c === " " ? "\u00A0" : c}
          </span>
        );
      })}
    </div>
  );
};
