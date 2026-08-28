# Roadmap y estado del proyecto

> Este archivo es la fuente de verdad del plan del proyecto. Si una sesión de
> Claude Code se corta o reinicia, leé este documento antes de asumir que hay
> que volver a planificar desde cero. Actualizalo al cerrar cada fase o al
> completar un bloque de trabajo importante dentro de una fase.

## Qué es este proyecto

Sitio web para una empresa que comercializa productos y soluciones de
identificación / código de barras. Fase 1 = sitio corporativo + catálogo +
generación de leads, **sin venta online todavía**. El modelo de datos y la
arquitectura están pensados para evolucionar a e-commerce en Fase 2 sin
reconstruir nada.

Principio rector: construir lo necesario para hoy sin bloquear el crecimiento
de mañana. No sobreingeniería, no infraestructura sin razón clara.

## Decisiones de arquitectura ya tomadas (no rediscutir sin motivo)

- **Hosting/frontend:** Next.js (App Router) en Vercel. Server Components,
  Route Handlers y Server Actions.
- **Base de datos:** PostgreSQL en Neon.
- **ORM:** Drizzle (elegido por integración directa con Neon, type safety y
  simplicidad de migraciones vs. Prisma).
- **Render:** no se usa en Fase 1. Se incorpora únicamente si aparece una
  necesidad real de workers/procesos persistentes/sincronización externa.
- **Panel de administración:** propio (dentro de la app), no CMS headless.
  Vive en `/admin`, autenticado con sesión propia (`lib/auth`).
- **Archivos (imágenes/PDFs):** Vercel Blob. Neon solo guarda URLs y metadata,
  nunca el binario.
- **Estado de publicación:** enum `publication_status` (`draft`, `published`,
  `hidden`, `archived`) aplicado a productos, categorías y marcas.
- **WhatsApp:** número centralizado en `lib/config/site.ts`
  (`NEXT_PUBLIC_WHATSAPP_NUMBER`), nunca hardcodeado en componentes.
- **Arquitectura de código:** feature-based. Cada dominio en
  `features/<dominio>/{queries.ts, admin-queries.ts, actions.ts}` +
  validación en `lib/validation/<dominio>.ts`.

## Estado de fases

### Fase 1A — Fundación técnica — ✅ Hecho
Next.js, TypeScript estricto, Tailwind, Neon, Drizzle, migraciones, variables
de entorno, base del sistema de diseño ("Trust & Authority").

### Fase 1B — Sitio corporativo — ✅ Hecho
Header, footer, navegación, Home, Empresa, Contacto, responsive.

### Fase 1C — Catálogo — ✅ Hecho
Categorías, subcategorías, marcas, listado de productos, búsqueda, filtros.

### Fase 1D — Productos — ✅ Hecho
Página individual, galería, especificaciones, documentos, productos
relacionados, SEO básico de producto.

### Fase 1E — Panel de administración — ✅ Hecho
Auth admin, gestión de productos/categorías/marcas, imágenes, documentos,
estados de publicación, destacados, control de contenido visible.

### Fase 1F — Leads y contacto — ✅ Hecho
Formularios reutilizables, tabla `inquiries`, WhatsApp contextual (producto/
categoría/general), notificaciones de leads nuevos, honeypot anti-spam.

### Fase 1G — SEO, performance y producción — 🔄 En curso

**Hecho:**
- `app/sitemap.ts` — dinámico, lee categorías/marcas/productos/páginas legales
  publicados de Neon (no hardcodeado).
- `app/robots.ts` — permite todo salvo `/admin`, referencia el sitemap.
- `metadataBase` en `app/layout.tsx`.
- `canonical` en todas las páginas públicas (incluye `/privacidad` y `/terminos`).
- `noindex, nofollow` en todo `/admin` (`app/admin/layout.tsx`).
- JSON-LD `Organization` global y `BreadcrumbList` en producto/categoría, vía
  `lib/seo/jsonld.ts`. `Organization` sin logo todavía (falta asset real).
- **ISR/`revalidate`:** Home `revalidate = 3600` (antes era 100% estático sin
  refrescar nunca); producto y marca `revalidate = 300` (ISR on-demand, sin
  `generateStaticParams` — cachean tras el primer request). Catálogo y
  categoría se quedan dinámicos (`ƒ`) porque usan `searchParams` para
  filtros/orden — Next los fuerza a dynamic rendering, `revalidate` no aplica
  ahí. Las actions de publicar/editar/borrar producto, categoría y marca ahora
  además llaman `revalidatePath("/")` para que Home (destacados/categorías/
  marcas) se actualice al instante y no dependa solo del revalidate horario.
- **LCP:** `priority` en la primera imagen de cada grilla de productos (Home
  destacados, `/catalogo`, `/catalogo/[categorySlug]`, `/marcas/[slug]`) vía
  prop `priority` en `ProductCard`. La galería de producto ya tenía `priority`
  en la imagen principal desde antes.
- **Rate limiting** en `submitInquiryAction`: se agregó columna
  `inquiries.ip_address` (migración `drizzle/0001_happy_sandman.sql`,
  aplicada en Neon) + índice compuesto `(ip_address, created_at)`. Máx. 3
  consultas cada 10 minutos por IP; se suma al honeypot existente, sin traer
  infraestructura nueva (Redis/Upstash).
- **Legales:** `/privacidad` y `/terminos` (estáticas, con canonical y
  enlazadas desde el footer). Contenido redactado a medida para este negocio
  (sin venta online, formulario de consultas, WhatsApp) siguiendo la
  estructura habitual de este tipo de páginas en Argentina (Ley 25.326).
  Quedan placeholders `[Completar: ...]` para razón social, CUIT, domicilio y
  jurisdicción — dato de negocio que falta.

**Pendiente:**
1. Revisión de headers de seguridad básicos (CSP, `X-Frame-Options` en admin).
2. Checklist de producción: confirmar `NEXT_PUBLIC_SITE_URL` en Vercel
   (prod vs preview — hoy cae al fallback de `VERCEL_URL` si no está seteada),
   fallback de OG image cuando el producto no tiene imagen.

**Explícitamente fuera de alcance en 1G:** Render (sigue sin razón técnica),
CAPTCHA (honeypot + rate limiting alcanza), cambios al modelo de datos de
producto (eso quedó documentado como P0 de Fase 1H, abajo).

### Fase 1H — Auditoría AIDC (SEO/AEO/GEO + arquitectura de catálogo) — 🔄 En curso

Auditoría completa entregada como artifact (equipo Technical SEO + AEO/GEO +
Information Architect + CRO). El roadmap completo (con archivos afectados)
vive en el informe; acá el resumen para no tener que reabrirlo:

**Hecho:**
- Primer lote de catálogo real cargado (contenido, no código — vía script
  puntual contra Neon, no vive en el repo): marca **Zebra** (publicada);
  categorías top-level **Impresoras** (con subcategoría Industriales),
  **Computadoras móviles**, **Escáneres de códigos de barras** y **RFID**
  (las 4 primeras replican la navegación real de zebra.com); 4 productos
  publicados con specs técnicas reales tomadas de datasheets oficiales de
  Zebra y la ficha técnica oficial enlazada como documento descargable:
  **ZT411** (impresora industrial), **TC22** (cómputo móvil), **DS2208**
  (escáner) y **FX9600** (lector RFID fijo). Ninguno tiene fotos propias
  todavía — no se pueden usar imágenes de Zebra/terceros sin derechos; hay
  que subir fotos reales desde `/admin/productos` cuando estén disponibles.
- Tarjetas de categoría con ícono en Home (`components/layout/category-icon.tsx`),
  idea tomada de barcodesinc.com — reemplaza las tarjetas de solo texto.

**Pendiente — P0 (antes de seguir cargando catálogo):**
- Extender `products` con `mpn`, `condition`, `availability`, y tipar
  `productRelationships.type` con un valor `compatible` (hoy solo admite
  `related`/`accessory`) — migración trivial ahora que hay pocos SKUs,
  cara de hacer después con el catálogo grande.
- Reemplazar el copy placeholder de Home (`app/(public)/page.tsx`) y Empresa
  (`app/(public)/empresa/page.tsx`) — hay `TODO` literales en el código.
- Definir NAP real (dirección, teléfono, horario) y agregar `LocalBusiness`
  junto al `Organization` existente — hoy no hay ningún dato de contacto
  físico en el sitio.
- Seguir completando el catálogo (subcategorías dentro de Computadoras
  móviles/Escáneres/RFID, más SKUs por categoría, insumos/consumibles).

**P1 — alto impacto:**
- `Offer` en el JSON-LD de producto (requiere antes decidir política de
  precios: ¿mostrar precio o siempre "consultar"?).
- Campo cantidad/volumen en el formulario de leads (para cotizar insumos por
  caja/rollo — `lib/db/schema.ts`, `lib/validation/inquiry.ts`,
  `inquiry-form.tsx`).
- Rutas nuevas: Servicio Técnico, Soluciones por Industria, Recursos Técnicos
  — hoy no existen ni como página ni como categoría especial.
- `FAQPage` reutilizable (helper en `lib/seo/jsonld.ts` + componente).

**P2/P3:** guías técnicas (TechArticle/HowTo), página de aterrizaje por
datasheet (hoy los PDF cuelgan sueltos, link directo al blob), buscador de
compatibilidad insumo↔impresora, comparador de specs.

**Ideas de diseño (referencia: barcodesinc.com, competidor de referencia en
hardware AIDC B2B)** — para aplicar cuando se rediseñe Home/catálogo, no
implementadas todavía:
- Grilla de categorías con ícono por tipo de hardware (impresoras, lectores,
  colectores, RFID...) en vez de solo texto — hoy las categorías en Home son
  tarjetas de texto plano (`app/(public)/page.tsx`).
- Sellos de garantía/confianza arriba del fold — **ya lo tenemos** vía
  `components/layout/trust-badges.tsx`, solo falta contenido real.
- "Buscador de compatibilidad" (insumo↔impresora) como herramienta destacada,
  no solo un filtro más — coincide con el P3 de arriba.
- Centro de recursos en el footer (generador de códigos, guías de selección,
  drivers) — refuerza posicionamiento técnico, no solo transaccional; encaja
  con el pilar "Recursos Técnicos" del P1.
- Teléfono/WhatsApp de ventas visible en el header, no solo en Contacto —
  hoy el WhatsApp flotante ya cumple ese rol, evaluar si conviene además en
  el header para desktop.

### Fase 2 — E-commerce — ⏸️ No iniciar sin aprobación explícita
Roadmap conceptual (clientes, variantes, precios, stock, carrito, checkout,
pagos, pedidos, envíos, promociones). El modelo de datos actual ya está
preparado para esto; no crear tablas ni pantallas de esta fase todavía.

## Cómo seguir si una sesión se corta

1. Leer este archivo — dice qué fase está en curso y qué está hecho/pendiente
   dentro de esa fase.
2. Correr `git log --oneline -15` para confirmar el último commit real
   (este documento puede quedar un paso adelante o atrás del último commit).
3. Retomar por el primer ítem pendiente listado arriba, no replantear la
   arquitectura salvo que el usuario lo pida explícitamente.
