import { Link } from "react-router-dom";
import { Zap } from 'lucide-react';

const HeroSection = () => (
  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 shadow-lg max-w-4xl mx-auto mb-16">
    <div className="text-center">
      <h2 className="text-3xl font-bold font-orbitron text-white mb-6">
        Secure Your Website in Minutes
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        Test your website against common vulnerabilities with ease. 
        Powered by OWASP ZAP API for instant security insights.
      </p>
      <Link 
        to="/home"
        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
      >
        <Zap className="w-5 h-5 mr-2" />
        Start Scanning Now
      </Link>
    </div>
  </div>
);

export default HeroSection;