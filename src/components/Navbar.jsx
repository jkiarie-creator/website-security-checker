import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full">
      <div className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-[#15172A] via-[#0E0C2F] to-[#000439] shadow-md">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-red-600 text-2xl mr-2">🛡️</span>
            <span className="text-white font-['Orbitron'] text-4xl">Website Security Checker</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-8 pr-4">
          <Link to="/" className="text-white hover:text-[#38bdf8] transition-colors duration-200">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-[#38bdf8] transition-colors duration-200">
            About
          </Link>
          <Link to="/home" className="text-white hover:text-[#38bdf8] transition-colors duration-200">
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;