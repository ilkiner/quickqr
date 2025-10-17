import Hero from "../components/Hero";
import QRTypeGrid from "../components/QRTypeGrid";
import CustomCTA from "src/components/CustomCTA";
import WhyQuickQR from "src/components/WhyQuickQR";
import HowItWorks from "src/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Hero />
      <QRTypeGrid />
      <CustomCTA />
      <WhyQuickQR />
      <HowItWorks />
      
    </main>
  );
}
