import { Composition } from "remotion";
import { HeroVideo } from "./HeroVideo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HeroVideo"
      component={HeroVideo}
      durationInFrames={540}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
