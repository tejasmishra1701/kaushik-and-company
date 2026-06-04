import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PracticeAreas from "@/components/PracticeAreas";
import Team from "@/components/Team";
import Credentials from "@/components/Credentials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Intro />
      <Navbar />
      <Hero />
      <About />
      <PracticeAreas />
      <Team />
      <Credentials />
      <Contact />
      <Footer />
    </main>
  );
}