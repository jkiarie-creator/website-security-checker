<div align="center">
  <h1 align="center">🛡️ Website Security Scanner</h1>
  <p align="center">
    A modern web application for automated security scanning powered by OWASP ZAP
    <br />
    <a href="#demo"><strong>Explore the demo »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Get Started</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#documentation">Documentation</a>
    ·
    <a href="#contributing">Contributing</a>
  </p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fwebsite-security-checker)](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20security%20scanner%20built%20with%20React%20and%20OWASP%20ZAP%20API%20%F0%9F%9A%80%0A%0Ahttps%3A%2F%2Fgithub.com%2Fyourusername%2Fwebsite-security-checker)
</div>

## Features

- **Comprehensive Security Scanning**
  - Cross-Site Scripting (XSS) detection
  - Security header analysis
  - Insecure configuration detection
  - SQL injection testing
  - And 100+ other vulnerability checks

- **User-Friendly Interface**
  - Real-time progress tracking
  - Interactive results dashboard
  - Dark/light theme support
  - Responsive design for all devices

- **Advanced Features**
  - Scan history with local storage
  - Exportable reports (PDF/JSON)
  - Custom scan configurations
  - API documentation integration

## Tech Stack

- **Frontend**
  - React 18+ with Hooks
  - Tailwind CSS 3+
  - Vite for fast development
  - React Router DOM v6

- **Backend & Security**
  - OWASP ZAP API
  - Express.js proxy server
  - Rate limiting & CORS protection

- **Development Tools**
  - ESLint + Prettier
  - Husky for Git hooks
  - Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 16.14+ and npm 8.5+
- OWASP ZAP 2.12+ (for local development)
- Modern web browser (Chrome, Firefox, Edge, or Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/website-security-checker.git
   cd website-security-checker
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   # Frontend
   VITE_ZAP_API_KEY=your_zap_api_key
   VITE_ZAP_BASE_URL=http://localhost:8080
   
   # Server
   PORT=3001
   ZAP_API_URL=http://localhost:8080
   ZAP_API_KEY=your_zap_api_key
   ```

4. **Start the development servers**
   ```bash
   # In one terminal (frontend)
   npm run dev
   
   # In another terminal (backend)
   cd server
   npm start
   ```

5. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Documentation

### Running ZAP Proxy
1. Download and install [OWASP ZAP](https://www.zaproxy.org/download/)
2. Launch ZAP and go to `Tools` > `Options` > `API`
3. Set an API key and enable the API
4. Note the API URL (default: http://localhost:8080)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OWASP ZAP](https://www.zaproxy.org/) for the amazing security scanning tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the component-based UI library
- [Vite](https://vitejs.dev/) for the fast development experience

---

<div align="center">
  Made with ❤️ by jkiarie-creator - Feel free to contact me!
</div>
