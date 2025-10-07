import { Link } from "react-router-dom";


const HeroSection = () => (
  <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <h2 className="text-4xl md:text-3xl font-orbitron font-bold  ">
      Secure Your Website in Minutes
    </h2>
    <p className="mt-4 max-w-xl mx-auto text-lg font-inter">
      Test your website against common vulnerabilities with ease. <br />
      Powered by OWASP ZAP API for instant security insights.
    </p>
    <Link to="/home" 
       className="mt-8 inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
      Start Scanning Now
    </Link>
  </section>
);
export default HeroSection;