// mock data for testing purposes
export const mockScanResults = [
  {
    id: 1,
    title: "Cross-Site Scripting (XSS)",
    severity: "high",
    description: "User input is not properly sanitized in the search field, allowing potential XSS attacks.",
    confidence: "High",
    url: "https://example.com/search",
  },
  {
    id: 2,
    title: "Missing Security Headers",
    severity: "medium",
    description: "The site is missing critical security headers: Content-Security-Policy, X-Frame-Options, and X-XSS-Protection.",
    confidence: "High",
    url: "https://example.com/",
  },
  {
    id: 3,
    title: "Insecure Cookies",
    severity: "medium",
    description: "Session cookies are not set with Secure and HttpOnly flags, making them vulnerable to theft and manipulation.",
    confidence: "Medium",
    url: "https://example.com/login",
  },
  {
    id: 4,
    title: "Directory Listing Enabled",
    severity: "low",
    description: "Directory listing is enabled on the server, potentially exposing sensitive files and folders.",
    confidence: "High",
    url: "https://example.com/assets/",
  },
  {
    id: 5,
    title: "Information Disclosure",
    severity: "low",
    description: "Server is revealing version information in HTTP headers.",
    confidence: "Medium",
    url: "https://example.com/api/",
  }
];