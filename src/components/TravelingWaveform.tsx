import { useEffect, useRef } from "react";
import type { SpeechState } from "../lib/useSpeech";

const BARS = 41;
const BAR_WIDTH = 4;
const BAR_GAP = 3;
const HEIGHT = 56;
const PULSE_ORIGIN = 4;   // bar index where new pulses spawn (left edge)
const PULSE_SPEED = 58;   // bars per second travel

/**
 * Fake-but-convincing speech-reactive waveform.
 *
 * We can't access the live audio stream from SpeechSynthesis. Instead, each
 * `onboundary` event injects a "pulse" at the left edge that travels right
 * while decaying. Bar amplitude at time t is a sum of gaussian envelopes
 * from all active pulses, plus a low baseline sine-hum so the line never
 * looks dead. Pulses collapse into a central dot on "delivered".
 */
export default function TravelingWaveform({ state }: { state: SpeechState }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let raf = 0;
    const render = () => {
      const svg = svgRef.current;
      if (!svg) {
        raf = requestAnimationFrame(render);
        return;
      }
      const now = performance.now();
      const bars = svg.querySelectorAll<SVGRectElement>("rect.bar");

      const isDelivered = state.phase === "delivered";
      const isSpeaking = state.phase === "speaking" || state.phase === "paused";

      for (let i = 0; i < BARS; i++) {
        // baseline hum — always alive
        const baselineAmp = 0.08 + 0.04 * Math.sin(now * 0.003 + i * 0.4);

        let amp = baselineAmp;

        if (isDelivered) {
          // collapse into a single node near the center with a slow decay ring
          const center = BARS / 2;
          const d = Math.abs(i - center);
          amp = Math.max(baselineAmp, Math.exp(-(d * d) / 12) * 0.7);
        } else if (isSpeaking) {
          for (const p of state.pulses) {
            const age = now - p.bornAt;
            if (age > 900) continue;
            const travel = (age / 1000) * PULSE_SPEED * state.rate;
            const center = PULSE_ORIGIN + travel;
            if (center > BARS + 4) continue;
            const decay = Math.max(0, 1 - age / 900);
            amp += decay * Math.exp(-((i - center) ** 2) / (2 * p.width ** 2));
          }
        }

        amp = Math.min(1, amp);
        const h = 4 + amp * (HEIGHT - 4);
        const y = (HEIGHT - h) / 2;

        const bar = bars[i];
        if (!bar) continue;
        bar.setAttribute("height", String(h));
        bar.setAttribute("y", String(y));

        // color warms with amplitude — mint → cream → citrus at peak
        let fill = "#6EF7C4";
        if (amp > 0.45) fill = "#FCE8C8";
        if (amp > 0.7) fill = "#FFD23F";
        bar.setAttribute("fill", fill);
        bar.setAttribute("opacity", String(0.5 + amp * 0.5));
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const width = BARS * (BAR_WIDTH + BAR_GAP);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      className="mx-auto"
      aria-hidden
      style={{ maxWidth: "100%", height: "auto", filter: "drop-shadow(0 0 12px rgba(110,247,196,0.35))" }}
    >
      {Array.from({ length: BARS }, (_, i) => (
        <rect
          key={i}
          className="bar"
          x={i * (BAR_WIDTH + BAR_GAP)}
          y={HEIGHT / 2 - 2}
          width={BAR_WIDTH}
          height={4}
          rx={BAR_WIDTH / 2}
          fill="#6EF7C4"
          opacity={0.6}
        />
      ))}
    </svg>
  );
}
