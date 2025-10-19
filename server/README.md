# ZAP Proxy Server

This is a simple proxy server that handles CORS issues when making requests to the ZAP API from a web browser.

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure the environment variables in `.env` file:
   - `PORT`: Port for the proxy server (default: 3001)
   - `ZAP_API_URL`: URL of your ZAP API (e.g., http://localhost:8080)
   - `ZAP_API_KEY`: Your ZAP API key
   - `NODE_ENV`: Environment (development/production)

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /zap/*` - Proxies requests to ZAP API

## How It Works

The proxy server:
1. Adds CORS headers to all responses
2. Forwards requests to the ZAP API
3. Automatically adds the API key to all requests
4. Handles errors and provides meaningful error messages

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- In production, consider adding authentication to the proxy server
- Use HTTPS in production environments
