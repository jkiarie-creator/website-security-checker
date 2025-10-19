// mock data
export const mockScanResults = [
  {
    id: 1,
    title: "Cross-Site Scripting (XSS)",
    severity: "High",
    description: "User input is not properly sanitized in the search field.",
    url: "https://example.com/search",
  },
  {
    id: 2,
    title: "Missing Security Headers",
    severity: "Medium",
    description: "The site is missing 'Content-Security-Policy' header.",
    url: "https://example.com/",
  },
  {
    id: 3,
    title: "Insecure Cookies",
    severity: "Low",
    description: "Session cookies are not set with Secure and HttpOnly flags.",
    url: "https://example.com/login",
  },
];
