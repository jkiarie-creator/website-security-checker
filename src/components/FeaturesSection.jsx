import { Search, BarChart2, Save, FileText } from 'lucide-react';

const features = [
  { 
    icon: <Search className="w-8 h-8 text-cyan-400" />, 
    title: "Simple Scanning", 
    desc: "Enter a URL and run a security scan instantly." 
  },
  { 
    icon: <BarChart2 className="w-8 h-8 text-cyan-400" />, 
    title: "Clear Results", 
    desc: "Issues grouped by severity: High, Medium, Low." 
  },
  { 
    icon: <Save className="w-8 h-8 text-cyan-400" />, 
    title: "Save & Review", 
    desc: "Keep a history of past scans for tracking." 
  },
  { 
    icon: <FileText className="w-8 h-8 text-cyan-400" />, 
    title: "Download Reports", 
    desc: "Export results for documentation or sharing." 
  }
];

const FeaturesSection = () => (
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold font-orbitron text-white mb-4">Why Use Website Security Checker?</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Comprehensive security analysis for your web applications
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-center">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;