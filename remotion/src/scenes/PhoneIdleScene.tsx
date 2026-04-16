import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RotaryPhone } from "../components/RotaryPhone";
import { Caption } from "../components/Caption";

export const PhoneIdleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 50, 60], [0, 1, 1, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          width: 520,
          height: 340,
          opacity,
        }}
      >
        <RotaryPhone />
      </div>
      <Caption text="Pick up the phone." delay={20} />
    </AbsoluteFill>
  );
};
