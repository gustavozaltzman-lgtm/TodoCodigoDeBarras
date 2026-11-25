"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppUrl, siteConfig, whatsappMessages } from "@/lib/config/site";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (!siteConfig.whatsappNumber) return null;

  // En la ficha de producto la barra de cotizacion fija (solo mobile) ya
  // trae su propio acceso a WhatsApp, asi que el boton flotante se oculta
  // ahi para no tapar contenido ni duplicar el acceso.
  const onProductPage = pathname.startsWith("/productos/");

  return (
    <a
      href={buildWhatsAppUrl(whatsappMessages.general())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed right-4 z-50 h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all [bottom:calc(1.25rem+env(safe-area-inset-bottom,0px))] hover:bg-green-600 active:scale-95 sm:right-5 ${
        onProductPage ? "hidden lg:flex" : "flex"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm5.83 14.11c-.25.7-1.45 1.34-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.61-1.21-3.07s.76-2.18 1.03-2.48c.27-.3.59-.37.78-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.25.6.84 2.07.91 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.02.97.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
      </svg>
    </a>
  );
}
