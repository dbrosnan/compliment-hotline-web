import { AbsoluteFill, Series } from "remotion";
import { PhoneIdleScene } from "./scenes/PhoneIdleScene";
import { PhoneRingingScene } from "./scenes/PhoneRingingScene";
import { ReceiverLiftScene } from "./scenes/ReceiverLiftScene";
import { CartRevealScene } from "./scenes/CartRevealScene";
import { RecordInviteScene } from "./scenes/RecordInviteScene";
import { LogoCTAScene } from "./scenes/LogoCTAScene";
import { SparkleField } from "./components/SparkleField";

export const HeroVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #1A1040 0%, #0B0820 80%)" }}>
      <SparkleField count={40} />
      <Series>
        <Series.Sequence durationInFrames={60}>
          <PhoneIdleScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={75}>
          <PhoneRingingScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={105}>
          <ReceiverLiftScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={105}>
          <CartRevealScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={105}>
          <RecordInviteScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <LogoCTAScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
