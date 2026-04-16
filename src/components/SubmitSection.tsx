import { useState } from "react";
import TextForm from "./TextForm";
import RotaryRecorder from "./RotaryRecorder";

type Tab = "text" | "audio";

export default function SubmitSection() {
  const [tab, setTab] = useState<Tab>("text");

  return (
    <section id="submit" className="relative py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="label-caps mb-4">Your turn</div>
          <h2 className="font-display text-5xl md:text-7xl text-cream">
            LEAVE ONE
          </h2>
          <p className="mt-4 text-cream/80 max-w-xl mx-auto">
            Kind. Specific. 30 seconds or 500 characters. Gets queued, reviewed, then plays on a real phone at the next festival.
          </p>
        </div>

        <div className="card p-6 md:p-10">
          <div className="flex gap-2 p-1 rounded-full bg-midnight border border-cream/10 w-fit mx-auto mb-8">
            <TabButton active={tab === "text"} onClick={() => setTab("text")}>
              ✍️ Text
            </TabButton>
            <TabButton active={tab === "audio"} onClick={() => setTab("audio")}>
              🎙 Audio
            </TabButton>
          </div>

          {tab === "text" ? <TextForm /> : <RotaryRecorder />}
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
        active
          ? "bg-coral text-midnight shadow-glow"
          : "text-cream/70 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}
