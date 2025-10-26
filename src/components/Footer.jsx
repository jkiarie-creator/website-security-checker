import { ShieldCheck } from 'lucide-react';

const Footer = () => (
  <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-orbitron font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                WebSec Checker
              </span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Web Security Checker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
);

export default Footer;
