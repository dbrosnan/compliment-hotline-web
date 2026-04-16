import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import ComplimentMarquee from "./components/ComplimentMarquee";
import SubmitSection from "./components/SubmitSection";
import Counter from "./components/Counter";
import Footer from "./components/Footer";
import CoiledCord from "./components/CoiledCord";

export default function App() {
  return (
    <main className="relative overflow-x-hidden">
      <Hero />
      <ComplimentMarquee />
      <CoiledCord />
      <HowItWorks />
      <CoiledCord flipped />
      <Counter />
      <SubmitSection />
      <Footer />
    </main>
  );
}
