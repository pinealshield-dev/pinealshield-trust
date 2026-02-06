import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // No framing (anti clickjacking)
          { key: "X-Frame-Options", value: "DENY" },

          // No sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Referrer controlado
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // HTTPS estricto (activar SOLO en prod)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // CSP mínima (no bloquea QR ni SVG)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-inline'",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join("; "),
          }
        ],
      },
    ];
  },
};

export default nextConfig;
