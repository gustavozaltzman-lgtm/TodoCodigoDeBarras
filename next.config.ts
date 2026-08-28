import type { NextConfig } from "next";

// CSP estatica (misma en toda respuesta) en vez de nonce por request: el
// nonce dinamico rompia la hidratacion en paginas con ISR/cache estatico
// (Home, producto, marca, institucionales) -- el HTML cacheado queda con un
// nonce viejo grabado en los scripts inline, pero cada respuesta nueva traia
// un nonce distinto en el header CSP, asi que nunca coincidian y el
// navegador bloqueaba todos los scripts de hidratacion (menu, formularios,
// todo lo interactivo dejaba de responder). Con valor estatico + cache no
// hay ese problema; se pierde el bloqueo estricto de scripts inline pero se
// mantiene el resto de la politica.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.blob.vercel-storage.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
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
  async redirects() {
    // Categorias renombradas en el sprint de reestructuracion B2B (ver
    // docs/ROADMAP.md) -- slugs viejos deben apuntar a los nuevos, tanto
    // para no romper links ya compartidos como para SEO (evitar URLs
    // duplicadas/competidoras).
    const renamedCategorySlugs: [string, string][] = [
      ["impresoras", "impresion"],
      ["computadoras-moviles", "movilidad"],
      ["escaneres-codigos-de-barras", "captura-de-datos"],
      ["insumos-y-consumibles", "consumibles"],
    ];
    return renamedCategorySlugs.map(([from, to]) => ({
      source: `/catalogo/${from}`,
      destination: `/catalogo/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
