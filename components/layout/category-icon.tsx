type CategoryIconProps = {
  slug: string;
  className?: string;
};

const ICONS: Record<string, React.ReactNode> = {
  "computadoras-moviles": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  ),
  impresoras: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
    />
  ),
  "escaneres-codigos-de-barras": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 4.5v3m0-3h3m-3 0 3.5 3.5M3.75 19.5v-3m0 3h3m-3 0 3.5-3.5M20.25 4.5v3m0-3h-3m3 0-3.5 3.5M20.25 19.5v-3m0 3h-3m3 0-3.5-3.5M9 6v12M12 6v12M15 6v12"
    />
  ),
  rfid: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.75 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  ),
};

const FALLBACK_ICON = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25-3v3m0-3h3m-3 0h-3m-1.5 3h9"
  />
);

export function CategoryIcon({ slug, className }: CategoryIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      {ICONS[slug] ?? FALLBACK_ICON}
    </svg>
  );
}
