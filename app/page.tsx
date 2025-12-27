import NavBar from "@/app/components/NavBar";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Footer from "@/app/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30">
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}