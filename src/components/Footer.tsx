export default function Footer() {
  return (
    <footer className="border-t border-cream/10 py-12 px-6 text-center text-sm text-cream/50">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="font-display text-3xl text-cream">COMPLIMENT HOTLINE</div>
        <div>An art piece, a cart, eight phones, and you.</div>
        <div className="flex justify-center gap-6 text-cream/70">
          <a href="#how" className="hover:text-coral transition-colors">How it works</a>
          <a href="#submit" className="hover:text-coral transition-colors">Leave one</a>
          <a href="mailto:hello@complimenthotline.org" className="hover:text-coral transition-colors">Say hi</a>
        </div>
        <div className="text-xs text-cream/30">© {new Date().getFullYear()} Compliment Hotline. All kindness reserved.</div>
      </div>
    </footer>
  );
}
