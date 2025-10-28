require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;
const ZAP_API_URL = process.env.ZAP_API_URL || 'http://localhost:8090';
const ZAP_API_KEY = process.env.ZAP_API_KEY;

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use(limiter);

// Enable CORS for all routes
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create proxy middleware for ZAP API
const zapProxy = createProxyMiddleware({
  target: ZAP_API_URL,
  changeOrigin: true,
  secure: false, // Allow self-signed certificates
  pathRewrite: {
    '^/zap': '' // Remove /zap prefix when forwarding to ZAP
  },
  // Disable SSL certificate validation
  ssl: { rejectUnauthorized: false },
  // Add headers to help with HTTPS
  headers: {
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': '*/*'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add API key to all requests if it's set
    if (ZAP_API_KEY) {
      const url = new URL(proxyReq.path, ZAP_API_URL);
      url.searchParams.set('apikey', ZAP_API_KEY);
      proxyReq.path = url.pathname + url.search;
    }
    
    // Log the request
    console.log(`Proxying: ${req.method} ${req.path} -> ${ZAP_API_URL}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: err.message,
      details: {
        zapUrl: ZAP_API_URL,
        originalUrl: req.originalUrl,
        method: req.method
      }
    });
  },
  logLevel: 'debug',
  // Allow long-running ZAP operations (do not force a short proxy timeout)
  timeout: 0,
  proxyTimeout: 0,
  // Don't follow redirects
  followRedirects: false,
  // Don't retry failed requests
  retries: 0
});

// Apply proxy to all /zap/* routes
app.use('/zap', zapProxy);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`ZAP Proxy Server running on http://localhost:${PORT}`);
  console.log(`Proxying requests to: ${ZAP_API_URL}`);
});

// Remove any server-side timeouts to allow very long-running ZAP operations.
// Setting to 0 disables the automatic timeout behavior.
try {
  // Disable socket timeout (no automatic socket idle timeout)
  server.timeout = 0;

  // Disable keep-alive timeout (so connections aren't closed by the server)
  server.keepAliveTimeout = 0;

  // Disable headers timeout to avoid Node closing slow requests while headers are being received
  // Note: headersTimeout should be >= keepAliveTimeout in normal cases; setting both to 0 fully disables
  server.headersTimeout = 0;

  console.log('Server timeouts disabled: server.timeout, server.keepAliveTimeout, server.headersTimeout set to 0');
} catch (err) {
  console.warn('Failed to modify server timeout settings:', err && err.message);
}

module.exports = app;
