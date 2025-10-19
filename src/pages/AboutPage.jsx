import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, Code, Server, BarChart } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, children }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
    <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 text-cyan-400">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-orbitron font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{children}</p>
  </div>
);

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-cyan-900/20 text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/30">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Web Security Scanner
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Secure Your Web Presence
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            A powerful security scanning tool that helps you identify vulnerabilities in your web applications before they become a problem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Start Scanning
            </Link>
            <a 
              href="#how-it-works" 
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-orbitron text-white mb-4">Powerful Security Scanning</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our tool provides comprehensive security analysis for your web applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Zap} title="Quick Scans">
              Perform fast security assessments of your website's main pages to identify common vulnerabilities in seconds.
            </FeatureCard>
            
            <FeatureCard icon={Lock} title="In-Depth Analysis">
              Comprehensive scanning that examines your entire site structure for security weaknesses and potential threats.
            </FeatureCard>
            
            <FeatureCard icon={Code} title="Modern Web Support">
              Built to work with modern web technologies including SPAs, PWAs, and traditional websites.
            </FeatureCard>
            
            <FeatureCard icon={Server} title="API Security">
              Test your API endpoints for common security issues and misconfigurations.
            </FeatureCard>
            
            <FeatureCard icon={BarChart} title="Detailed Reports">
              Get clear, actionable reports with severity ratings and remediation advice.
            </FeatureCard>
            
            <FeatureCard icon={ShieldCheck} title="Continuous Protection">
              Schedule regular scans to monitor your site's security posture over time.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-orbitron text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Simple steps to secure your web application
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500/30 to-transparent md:block hidden"></div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold mr-4">1</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Enter Your URL</h3>
                <p className="text-gray-300">Simply enter your website's URL in the search bar and select your scan type.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500/30 to-transparent md:block hidden"></div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold mr-4">2</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Scan in Progress</h3>
                <p className="text-gray-300">Our system will analyze your website for security vulnerabilities in real-time.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500/30 to-transparent md:block hidden"></div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold mr-4">3</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Results</h3>
                <p className="text-gray-300">Receive a detailed report with identified vulnerabilities and recommended fixes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
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

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-orbitron font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                WebSec Scanner
              </span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Web Security Scanner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
