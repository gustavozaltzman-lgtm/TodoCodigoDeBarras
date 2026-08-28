import type { NextConfig } from "next";

// Content-Security-Policy se genera por request en proxy.ts (necesita nonce
// dinamico para los scripts inline que React/Next.js inyecta al hidratar).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
    // Logos de marca se suben como SVG. Next.js bloquea SVG remoto por
    // defecto (riesgo de script embebido); se habilita solo con la CSP
    // recomendada por Next para el optimizador de imagenes, que evita que
    // un SVG malicioso pueda ejecutar script incluso si lo tuviera.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
