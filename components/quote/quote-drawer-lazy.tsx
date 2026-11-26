"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuoteOpen } from "./quote-store";

// El panel (formulario, validacion, accion de envio) pesa bastante y casi nadie
// lo abre: se descarga recien al primer "abrir" y despues queda montado.
const QuoteDrawer = dynamic(
  () => import("./quote-drawer").then((m) => m.QuoteDrawer),
  { ssr: false }
);

export function QuoteDrawerLazy() {
  const open = useQuoteOpen();
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);
  return mounted ? <QuoteDrawer /> : null;
}
