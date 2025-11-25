import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import WhyMeetink from "@/components/WhyMeetink";
import EarlyAccess from "@/components/EarlyAccess";
import Footer from "@/components/Footer";
import OAuthErrorHandler from "@/components/OAuthErrorHandler";

export default function Home() {
  return (
    <main className="relative bg-black overflow-hidden">
      <OAuthErrorHandler />
      <Hero />
      <Features />
      <Showcase />
      <WhyMeetink />
      <EarlyAccess />
      <Footer />
    </main>
  );
}
