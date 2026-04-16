const STEPS = [
  {
    n: "01",
    title: "Find the cart",
    body: "Look for the wooden cart rolling around the festival, draped in phone cords and disco light. Eight landline phones, all real, all ringing.",
    accent: "text-coral",
  },
  {
    n: "02",
    title: "Pick up",
    body: "Grab the receiver. A stranger's compliment plays — something someone said out loud because they meant it.",
    accent: "text-citrus",
  },
  {
    n: "03",
    title: "Record yours",
    body: "After the beep, leave a compliment for whoever picks up next. 30 seconds. Be kind. Be specific.",
    accent: "text-mint",
  },
  {
    n: "04",
    title: "Or leave one here",
    body: "Can't make it to the cart? Drop a text or audio compliment below. We'll pipe it into the rotation.",
    accent: "text-magenta",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="label-caps mb-4">The whole bit</div>
          <h2 className="font-display text-5xl md:text-7xl text-cream">HOW IT WORKS</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6 group relative overflow-hidden">
              <div className={`font-display text-5xl ${s.accent} mb-4`}>{s.n}</div>
              <h3 className="text-2xl font-semibold text-cream mb-2">{s.title}</h3>
              <p className="text-cream/75 leading-relaxed">{s.body}</p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-coral/10 blur-2xl group-hover:bg-coral/30 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
