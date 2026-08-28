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
- `app/sitemap.ts` — dinámico, lee categorías/marcas/productos publicados de
  Neon (no hardcodeado).
- `app/robots.ts` — permite todo salvo `/admin`, referencia el sitemap.
- `metadataBase` en `app/layout.tsx`.
- `canonical` en: home (default del layout raíz), empresa, contacto,
  catálogo (canonicaliza sin query params), categoría, marca, producto.
- `noindex, nofollow` en todo `/admin` (`app/admin/layout.tsx`).
- JSON-LD `Organization` global (`app/layout.tsx`) y `BreadcrumbList` en
  producto y categoría, vía helpers en `lib/seo/jsonld.ts`. `Organization`
  no tiene logo todavía (falta asset real del cliente, queda TODO en el
  código).

**Pendiente (en este orden sugerido):**
1. Estrategia de `revalidate` (ISR) por tipo de página — hoy todo el
   catálogo/producto corre dinámico (SSR por request) sin caché declarada:
   - Home / institucionales: revalidate largo (~3600s)
   - Catálogo / categoría: revalidate corto (~60s)
   - Producto: revalidate medio, complementado con `revalidatePath` desde las
     actions de admin (mismo patrón que ya se usa en `inquiries`)
3. Auditoría de LCP: `priority` en imagen principal de producto y hero de
   Home, `sizes` correctos en `next/image`.
4. Rate limiting básico sobre `submitInquiryAction` (hoy solo hay honeypot,
   sin límite de volumen por IP).
5. Revisión de headers de seguridad básicos (CSP, `X-Frame-Options` en admin).
6. Checklist de producción: confirmar `NEXT_PUBLIC_SITE_URL` en Vercel
   (prod vs preview — hoy cae al fallback de `VERCEL_URL` si no está seteada),
   build limpio, fallback de OG image cuando el producto no tiene imagen.

**Explícitamente fuera de alcance en 1G:** Render (sigue sin razón técnica),
CAPTCHA (honeypot + rate limiting alcanza), cambios al modelo de datos.

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
