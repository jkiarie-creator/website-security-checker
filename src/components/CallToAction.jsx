import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const CallToActionSection = () => (
  <section className="py-20 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 my-16 rounded-2xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold font-orbitron text-white mb-6">Ready to Secure Your Website?</h2>
      <p className="text-xl text-gray-200 mb-8">
        Start scanning your website today and get instant security insights to protect your online presence.
      </p>
      <Link 
        to="/home"
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
      >
        <Zap className="w-5 h-5 mr-2" />
        Start Free Scan
      </Link>
    </div>
  </section>
);

export default CallToActionSection;