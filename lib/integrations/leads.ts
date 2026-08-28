import { Resend } from "resend";

const TYPE_LABELS: Record<string, string> = {
  general: "Consulta general",
  quote: "Solicitud de cotización",
  product: "Consulta de producto",
};

export type LeadNotificationPayload = {
  id: number;
  type: "general" | "quote" | "product";
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  sourceUrl: string | null;
};

// Punto de extension para integraciones futuras (HubSpot, Zoho, Salesforce,
// email marketing): agregar la llamada correspondiente aca, sin tocar la
// logica de los formularios que llaman a esta funcion.
export async function notifyNewLead(payload: LeadNotificationPayload) {
  await sendEmailNotification(payload);
}

async function sendEmailNotification(payload: LeadNotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFICATION_EMAIL;

  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "TodoCodigoDeBarras <onboarding@resend.dev>",
      to,
      replyTo: payload.email,
      subject: `Nueva consulta: ${TYPE_LABELS[payload.type]} — ${payload.name}`,
      text: [
        `Tipo: ${TYPE_LABELS[payload.type]}`,
        `Nombre: ${payload.name}`,
        payload.company ? `Empresa: ${payload.company}` : null,
        `Email: ${payload.email}`,
        payload.phone ? `Teléfono: ${payload.phone}` : null,
        payload.country ? `País: ${payload.country}` : null,
        payload.sourceUrl ? `Origen: ${payload.sourceUrl}` : null,
        "",
        "Mensaje:",
        payload.message,
        "",
        `Ver en el panel: /admin/consultas`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error) {
    console.error("Error enviando notificacion de lead:", error);
  }
}
