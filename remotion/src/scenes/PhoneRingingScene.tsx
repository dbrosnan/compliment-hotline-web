import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RotaryPhone } from "../components/RotaryPhone";
import { DiscoBall } from "../components/DiscoBall";
import { Caption } from "../components/Caption";

export const PhoneRingingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shake = spring({ frame, fps, config: { damping: 4, mass: 0.4 } });
  const wobble = Math.sin(frame * 1.2) * shake * 6;

  return (
    <AbsoluteFill>
      {/* Sound wave arcs */}
      {[0, 1, 2].map((i) => {
        const startFrame = i * 10;
        const progress = interpolate(frame, [startFrame, startFrame + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const scale = 0.4 + progress * 1.6;
        const op = 1 - progress;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "45%",
              transform: `translate(-50%, -50%) scale(${scale})`,
              width: 600,
              height: 600,
              opacity: op,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="40" stroke="#FF5E6C" strokeWidth="1.2" fill="none" opacity="0.8" />
            </svg>
          </div>
        );
      })}
      {/* Disco ball */}
      <div style={{ position: "absolute", top: 60, right: 80 }}>
        <DiscoBall size={180} />
      </div>
      {/* Phone */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: `translate(-50%, -50%) rotate(${wobble}deg)`,
          width: 520,
          height: 340,
        }}
      >
        <RotaryPhone />
      </div>
      <Caption text="A stranger left you a compliment." delay={10} />
    </AbsoluteFill>
  );
};
