// Isotipo simple: huella digital estilizada como pista de circuito que se
// resuelve en barras de codigo de barras -- identificacion + AIDC en un solo
// trazo. SVG hecho a mano (no imagen generada) para que escale nitido a
// cualquier tamano, incluido favicon.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" className="fill-primary" />
      <path
        d="M16 6.5c-3.5 0-6.2 2.6-6.6 6M16 6.5c3.5 0 6.2 2.6 6.6 6M16 9.5c-2 0-3.6 1.6-3.8 3.6M16 9.5c2 0 3.6 1.6 3.8 3.6M16 12.7v6.6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <g className="fill-accent">
        <rect x="9" y="21" width="1.3" height="6" />
        <rect x="11.2" y="21" width="0.7" height="6" />
        <rect x="12.7" y="21" width="1.3" height="6" />
        <rect x="14.9" y="21" width="0.7" height="6" />
        <rect x="16.4" y="21" width="1.8" height="6" />
        <rect x="19" y="21" width="0.7" height="6" />
        <rect x="20.5" y="21" width="1.3" height="6" />
        <rect x="22.7" y="21" width="0.7" height="6" />
      </g>
    </svg>
  );
}
