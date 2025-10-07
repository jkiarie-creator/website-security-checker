const features = [
  { icon: "🔍", title: "Simple Scanning", desc: "Enter a URL and run a security scan instantly." },
  { icon: "📊", title: "Clear Results", desc: "Issues grouped by severity: High, Medium, Low." },
  { icon: "💾", title: "Save & Review", desc: "Keep a history of past scans for tracking." },
  { icon: "📄", title: "Download Reports", desc: "Export results for documentation or sharing." }
];

const FeaturesSection = () => (
  <section className="py-16 bg-white/90 text-gray-900 border-y-4 border-blue-200">
    <h3 className="text-3xl font-bold text-center mb-10 font-orbitron">
      Why Use Website Security Checker?
    </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {features.map((f, idx) => (
        <div
          key={idx}
          className="group p-6 bg-white rounded-xl shadow-lg transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex flex-col items-center text-center border border-blue-200"
        >
          <div className="text-4xl mb-2">{f.icon}</div>
          <h4 className="mt-2 text-lg font-semibold">{f.title}</h4>
          <p className="text-gray-600 mt-2">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
export default FeaturesSection;