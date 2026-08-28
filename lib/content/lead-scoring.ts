// Opciones de calificacion de leads del formulario de consulta. Valores
// controlados (no texto libre) para poder filtrar/priorizar consultas desde
// el panel de admin sin depender solo del mensaje.
export const INTEREST_OPTIONS = [
  { value: "impresoras", label: "Impresoras" },
  { value: "lectores", label: "Lectores" },
  { value: "computo_movil", label: "Computadoras Móviles" },
  { value: "rfid", label: "RFID" },
  { value: "etiquetas_ribbons", label: "Etiquetas/Ribbons" },
  { value: "asesoramiento_general", label: "Asesoramiento General" },
] as const;

export const SECTOR_OPTIONS = [
  { value: "deposito_logistica", label: "Depósito/Logística" },
  { value: "retail", label: "Retail" },
  { value: "manufactura", label: "Manufactura" },
  { value: "salud", label: "Salud" },
  { value: "control_activos", label: "Control de Activos" },
] as const;

export type InterestValue = (typeof INTEREST_OPTIONS)[number]["value"];
export type SectorValue = (typeof SECTOR_OPTIONS)[number]["value"];

export const INTEREST_LABELS: Record<string, string> = Object.fromEntries(
  INTEREST_OPTIONS.map((o) => [o.value, o.label])
);
export const SECTOR_LABELS: Record<string, string> = Object.fromEntries(
  SECTOR_OPTIONS.map((o) => [o.value, o.label])
);
