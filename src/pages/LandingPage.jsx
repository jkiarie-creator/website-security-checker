import HeroSection from "../components/HeroSection";
import CallToActionSection from "../components/CallToAction";
import FeaturesSection from "../components/FeaturesSection";
import { ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-cyan-900/20 text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/30">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Web Security Scanner
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Secure Your Web Presence
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A powerful security scanning tool that helps you identify vulnerabilities in your web applications before they become a problem.
          </p>
        </div>
        
        <HeroSection />
        <FeaturesSection />
        <CallToActionSection />
      </div>
    </div>
  );
};

export default LandingPage;
