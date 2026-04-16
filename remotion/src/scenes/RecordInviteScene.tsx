import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RotaryPhone } from "../components/RotaryPhone";
import { Caption } from "../components/Caption";

export const RecordInviteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.4));
  const cursorOn = Math.floor(frame / 12) % 2 === 0;

  return (
    <AbsoluteFill>
      {/* Phone with receiver already up */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          width: 420,
          height: 270,
        }}
      >
        <RotaryPhone receiverLift={1} receiverRotation={18} />
      </div>

      {/* Record dot + label */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 280,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#FF5E6C",
            opacity: pulse,
            boxShadow: `0 0 ${20 * pulse}px #FF5E6C`,
          }}
        />
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 32, color: "#FF5E6C", fontWeight: 700, letterSpacing: 2 }}>
          REC
        </div>
      </div>

      {/* Empty speech bubble with blinking cursor */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 260,
          padding: "30px 40px",
          borderRadius: 32,
          background: "#FCE8C8",
          minWidth: 500,
          minHeight: 120,
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 44,
          color: "#0B0820",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ opacity: 0.4 }}>say something kind</span>
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: 42,
            background: "#0B0820",
            marginLeft: 8,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </div>

      {/* Hearts rising */}
      {Array.from({ length: 6 }).map((_, i) => {
        const birth = i * 12;
        const age = frame - birth;
        if (age < 0) return null;
        const y = interpolate(age, [0, 90], [900, 200], { extrapolateRight: "clamp" });
        const op = interpolate(age, [0, 20, 80, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });
        const xDrift = Math.sin(age / 15 + i) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 400 + i * 140 + xDrift,
              top: y,
              opacity: op,
            }}
          >
            <svg viewBox="0 0 40 40" width="56" height="56">
              <path
                d="M20 36 C8 26, 2 18, 2 12 C2 6, 8 2, 12 2 C16 2, 20 6, 20 10 C20 6, 24 2, 28 2 C32 2, 38 6, 38 12 C38 18, 32 26, 20 36 Z"
                fill="#E94BD6"
                stroke="#FCE8C8"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        );
      })}

      <Caption text="Now leave one for the next stranger." delay={15} />
    </AbsoluteFill>
  );
};
