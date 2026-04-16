import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  text: string;
  x: number;
  y: number;
  enterFrame?: number;
};

export const SpeechBubble: React.FC<Props> = ({ text, x, y, enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 180 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: "bottom left",
        maxWidth: 520,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "24px 30px",
          borderRadius: 28,
          background: "#FCE8C8",
          color: "#0B0820",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <em>"{text}"</em>
        <div
          style={{
            position: "absolute",
            left: -14,
            bottom: 16,
            width: 0,
            height: 0,
            borderTop: "14px solid transparent",
            borderBottom: "14px solid transparent",
            borderRight: "18px solid #FCE8C8",
          }}
        />
      </div>
    </div>
  );
};
