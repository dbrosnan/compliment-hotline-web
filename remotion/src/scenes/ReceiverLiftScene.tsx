import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { RotaryPhone } from "../components/RotaryPhone";
import { SpeechBubble } from "../components/SpeechBubble";
import { Caption } from "../components/Caption";

export const ReceiverLiftScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lift = spring({ frame, fps, config: { damping: 12, mass: 0.8, stiffness: 80 } });
  const rotation = spring({ frame, fps, config: { damping: 10, mass: 0.6 } }) * 18;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "35%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 520,
          height: 340,
        }}
      >
        <RotaryPhone receiverLift={lift} receiverRotation={rotation} />
      </div>
      <SpeechBubble text="your laugh is contagious" x={960} y={340} enterFrame={25} />

      {/* Waveform bars */}
      <div style={{ position: "absolute", left: 980, top: 500, display: "flex", gap: 8, alignItems: "flex-end", height: 60 }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const enter = 45;
          const on = interpolate(frame, [enter, enter + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const h = 20 + Math.abs(Math.sin(frame * 0.3 + i * 0.7)) * 40;
          return (
            <div
              key={i}
              style={{
                width: 10,
                height: `${h}px`,
                background: "#6EF7C4",
                borderRadius: 4,
                opacity: on,
                boxShadow: "0 0 10px #6EF7C4",
              }}
            />
          );
        })}
      </div>

      <Caption text="Listen." delay={10} />
    </AbsoluteFill>
  );
};
