import { useEffect, useState } from "react";
import { fetchRecent, type ComplimentItem } from "../lib/api";

const SEED: ComplimentItem[] = [
  { id: -1, name: "Annie", message: "your laugh is contagious and i hope you know it", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -2, name: null, message: "you're a good one. keep going.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -3, name: "M", message: "that jacket? a choice. and the right one.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -4, name: "stranger", message: "i saw you help someone at the water station. it mattered.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -5, name: null, message: "the way you moved at sunset was proof that joy is a real substance", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -6, name: "J", message: "your energy is the reason the room felt warmer", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -7, name: null, message: "you're allowed to take up space. please do.", has_audio: false, duration_ms: null, created_at: 0 },
  { id: -8, name: "phone 3", message: "whoever picks up next — i hope your day breaks open softly", has_audio: false, duration_ms: null, created_at: 0 },
];

export default function ComplimentMarquee() {
  const [items, setItems] = useState<ComplimentItem[]>(SEED);

  useEffect(() => {
    fetchRecent()
      .then((data) => {
        if (data.items.length > 0) {
          setItems([...data.items, ...SEED].slice(0, 16));
        }
      })
      .catch(() => {
        // keep seed
      });
  }, []);

  const doubled = [...items, ...items];

  return (
    <section className="relative py-10 border-y border-cream/10 bg-velvet/30">
      <div className="label-caps text-center mb-6">LIVE from the hotline</div>
      <div className="overflow-hidden">
        <div className="flex gap-4 animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
          {doubled.map((c, i) => (
            <div
              key={`${c.id}-${i}`}
              className="card px-6 py-4 min-w-[280px] max-w-[420px] shrink-0 inline-flex flex-col gap-1"
            >
              <div className="text-xs uppercase tracking-widest text-magenta">
                {c.name || "anonymous"}
              </div>
              <div className="text-cream text-base whitespace-normal leading-snug">
                "{c.message || (c.has_audio ? "🎙 audio compliment" : "")}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
