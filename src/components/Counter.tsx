import { useEffect, useState } from "react";
import { fetchStats } from "../lib/api";

export default function Counter() {
  const [count, setCount] = useState<number>(247);

  useEffect(() => {
    fetchStats()
      .then((s) => {
        if (typeof s.total === "number") setCount(s.total);
      })
      .catch(() => {});
  }, []);

  const digits = String(count).padStart(5, "0").split("");

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="label-caps mb-4">Total compliments received</div>
        <div className="flex justify-center gap-2">
          {digits.map((d, i) => (
            <div
              key={i}
              className="relative w-16 h-24 md:w-24 md:h-36 rounded-lg bg-midnight border border-cream/20 flex items-center justify-center font-display text-5xl md:text-7xl text-citrus shadow-inner"
            >
              <span className="relative z-10">{d}</span>
              <div className="absolute inset-x-0 top-1/2 border-t border-cream/10" />
            </div>
          ))}
        </div>
        <div className="mt-6 text-cream/60">and counting.</div>
      </div>
    </section>
  );
}
