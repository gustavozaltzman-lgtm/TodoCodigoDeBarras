# Ficha técnica

> Documento técnico de referencia. Actualizar cuando cambie el stack, el
> modelo de datos o la configuración de seguridad. Para el estado de avance
> del proyecto por fases, ver [ROADMAP.md](ROADMAP.md). Para cómo usar el
> panel de administración, ver [MANUAL-USUARIO.md](MANUAL-USUARIO.md).

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript (modo estricto) |
| UI | React 19, Tailwind CSS 4 |
| Base de datos | PostgreSQL en [Neon](https://neon.tech) |
| ORM | Drizzle ORM + Drizzle Kit (migraciones) |
| Archivos (imágenes/PDFs) | Vercel Blob |
| Emails transaccionales | Resend |
| Autenticación admin | Sesión propia (cookie firmada con HMAC), sin librería externa |
| Hosting | Vercel |

No se usa CMS headless (panel de administración propio) ni Render (sin
necesidad técnica todavía — ver `ROADMAP.md`).

### Notas de catálogo

- **Categorías con 0 productos publicados no se muestran en la navegación
  pública** (`features/categories/queries.ts` — `getPublishedTopCategories`,
  `getPublishedSubcategories`, `getAllPublishedCategorySlugs`). Para una
  categoría top-level esto cuenta productos propios + de sus subcategorías,
  así una categoría "contenedora" sigue apareciendo si alguna hija tiene
  stock. La categoría sigue siendo accesible por URL directa, solo no se
  linkea desde ningún lado.
- **`getCatalogProducts` filtra por categoría + sus subcategorías**, no por
  igualdad exacta de slug — los productos siempre cuelgan de una
  subcategoría, nunca de la categoría top-level directamente.
- **Redirects 301** en `next.config.ts` (`redirects()`) para slugs de
  categoría que cambiaron de nombre — necesario cada vez que se renombra
  una categoría existente, para no romper links compartidos ni duplicar
  URLs indexadas.

## Arquitectura de código

Feature-based. Cada dominio de negocio vive en `features/<dominio>/`:

- `queries.ts` — lecturas públicas (usadas por el sitio público)
- `admin-queries.ts` — lecturas para el panel de administración
- `actions.ts` — Server Actions (mutaciones), todas protegidas con
  `requireAdminSession()` salvo `submitInquiryAction` (pública, es el
  formulario de contacto)

Validación de inputs centralizada en `lib/validation/<dominio>.ts` (Zod).

No hay rutas de API custom (`app/**/route.ts`) — todas las mutaciones pasan
por Server Actions, lo que reduce la superficie de ataque (no hay endpoints
HTTP adicionales que proteger/documentar aparte de las páginas).

### Estructura de carpetas relevante

```
app/(public)/     páginas públicas del sitio
app/admin/        panel de administración (protegido)
app/sitemap.ts    sitemap dinámico
app/robots.ts     robots.txt
app/opengraph-image.tsx   imagen OG de fallback (generada con next/og)
components/       componentes de UI, separados en catalog/ forms/ layout/ admin/
features/         lógica de negocio por dominio (ver arriba)
lib/auth/         sesión y login del admin
lib/db/           cliente Drizzle, schema, migraciones (carpeta drizzle/), seed
lib/seo/          helpers de JSON-LD
lib/storage/      subida/borrado de archivos a Vercel Blob
lib/validation/   schemas Zod por dominio
proxy.ts          middleware: x-pathname para el admin (login vs. resto)
```

## Modelo de datos (Neon / Drizzle)

Tablas principales:

- **`users`** — admins del panel (`email`, `password_hash`, `role`)
- **`brands`** — marcas (con `status` de publicación)
- **`categories`** — categorías/subcategorías (auto-referenciada por `parent_id`)
- **`products`** — productos, con `mpn`, `condition`, `availability`,
  `status` de publicación, `is_featured`
- **`product_images`**, **`product_specifications`**, **`product_documents`**
  — datos hijos de producto (imágenes, specs técnicas, fichas/manuales)
- **`product_relationships`** — relación producto↔producto tipada
  (`related`, `accessory`, `compatible`)
- **`inquiries`** — leads del formulario de contacto (incluye `quantity`
  para cotizar insumos por caja/rollo, `ip_address` para rate limiting)
- **`login_attempts`** — rate limiting del login de admin

Estado de publicación (`publication_status`): `draft`, `published`, `hidden`,
`archived` — aplicado a productos, categorías y marcas. El contenido puede
existir en el sistema sin estar publicado (no hay que borrar nada para
ocultarlo).

Migraciones en `drizzle/*.sql`, generadas con `npm run db:generate` y
aplicadas con `npm run db:migrate`. **Nunca editar una migración ya aplicada
a producción** — generar una nueva.

## Seguridad

### Implementado

- **Autenticación:** sesión firmada con HMAC-SHA256 (`AUTH_SECRET`),
  verificación de firma con comparación de tiempo constante
  (`timingSafeEqual`), cookie `httpOnly` + `secure` (producción) +
  `sameSite: lax`. Contraseñas con bcrypt costo 12.
- **Autorización:** todas las Server Actions que mutan datos llaman
  `requireAdminSession()` — verificado en cada archivo `features/*/actions.ts`.
- **Rate limiting:**
  - Formulario de leads: máx. 3 envíos cada 10 min por IP
    (`inquiries.ip_address`).
  - Login de admin: bloquea después de 5 intentos fallidos por IP en 15
    min (`login_attempts`).
  - Ambos se suman a un honeypot anti-bot en el formulario de leads.
- **CSP (Content-Security-Policy):** estática, definida una sola vez en
  `next.config.ts` (misma en toda respuesta). Se probó primero con nonce
  dinámico por request en `proxy.ts`, pero **rompía la hidratación en
  cualquier página con ISR/cache estático** (Home, producto, marca,
  institucionales): el HTML cacheado queda con el nonce de cuando se generó
  grabado en los scripts inline, pero cada respuesta nueva servida desde
  caché pasa igual por el middleware, que generaba un nonce distinto para
  el header — nonce del HTML ≠ nonce del header, el navegador bloqueaba
  todos los scripts de hidratación y el sitio dejaba de responder (menú,
  formulario de leads, todo lo que dependa de JS) aunque se viera bien.
  Se volvió a CSP estática con `script-src 'self' 'unsafe-inline'` —
  se pierde el bloqueo estricto de scripts inline arbitrarios, pero el
  resto de la política se mantiene (`object-src 'none'`,
  `frame-ancestors 'none'`, `connect-src 'self'`, etc.) y es compatible con
  cualquier estrategia de caché. Headers adicionales en `next.config.ts`:
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`.
- **JSON-LD seguro:** todo dato inyectado vía `dangerouslySetInnerHTML` pasa
  por `jsonLdToScript()` (`lib/seo/jsonld.ts`), que escapa `<` para que un
  valor con `</script>` no pueda cerrar el tag e inyectar HTML/JS.
- **Sin SQL injection:** Drizzle ORM parametriza todas las queries; el único
  uso de `sql\`...\`` es un literal estático sin interpolación de datos de
  usuario.
- **Sin secretos en el repo:** `.env*` en `.gitignore`, solo `.env.example`
  versionado con valores vacíos.
- **`noindex, nofollow`** en todo `/admin` (metadata + `robots.ts`).

### Pendiente (de la auditoría de seguridad completa)

| Prioridad | Hallazgo | Archivo | Detalle |
|---|---|---|---|
| Media | Enumeración de usuarios por timing en login | `lib/auth/actions.ts` | Cuando el email no existe, la función retorna antes de correr `bcrypt.compare`, lo que crea una diferencia de tiempo medible. Fix: comparar siempre contra un hash dummy si el usuario no existe. |
| Media | Sin validación de tipo/tamaño de archivo en uploads | `lib/storage/blob.ts`, `features/products/actions.ts` | `uploadFile` acepta cualquier `File` sin chequear MIME type ni límite de tamaño explícito. Fix: allowlist de tipos (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) + tamaño máximo (ej. 5MB). |
| Media | Vulnerabilidad moderada en `esbuild` (vía `drizzle-kit`) | `package.json` (devDependency) | Solo afecta el dev server local (`next dev`, `drizzle-kit studio`), no producción. `npm audit fix --force` implica downgrade de `drizzle-kit` con breaking changes — no correrlo a ciegas. |
| Baja | Sesión sin revocación server-side | `lib/auth/session.ts` | `logoutAction` borra la cookie local, pero el token sigue siendo válido hasta expirar (7 días) si fue copiado. Relevante si hay más de un admin. Fix posible: campo `sessionVersion` en `users`. |
| Baja | `style-src 'unsafe-inline'` sin confirmar si es necesario | `proxy.ts` | No se encontró ningún `style={{...}}` en código de la app (fuera de `opengraph-image.tsx`, que no corre en el navegador). Probar sacarlo en un build real. |
| Baja | Nombre de archivo sin sanitizar en la key de Blob | `lib/storage/blob.ts` | `file.name` se usa directo en la key de almacenamiento. Riesgo bajo (Vercel Blob no tiene jerarquía real de directorios), pero conviene sanitizar. |
| Baja | Rate limiting depende de `x-forwarded-for` | `features/inquiries/actions.ts`, `lib/auth/actions.ts` | Correcto en Vercel (header no spoofeable ahí). Si el hosting cambia, revisar. |

## Variables de entorno

Ver `.env.example` para la lista completa. Resumen:

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a Neon (Postgres) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp centralizado (código de país, sin `+`) |
| `BLOB_READ_WRITE_TOKEN` | Subida de archivos a Vercel Blob |
| `AUTH_SECRET` | Firma de la cookie de sesión del admin (32+ caracteres random) |
| `RESEND_API_KEY` / `LEADS_NOTIFICATION_EMAIL` | Notificación por email de leads nuevos |
| `NEXT_PUBLIC_SITE_URL` | Dominio real del sitio (canonical, sitemap, OG) — **pendiente de confirmar en producción** |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Solo para `npm run db:seed` (crear/actualizar el usuario admin) |

En Vercel, estas variables se configuran en **Settings → Environment
Variables** del proyecto (por separado del `.env.local` local).

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build         # build de producción
npm run start          # servir el build de producción
npm run lint            # ESLint
npm run db:generate      # generar una migración a partir de cambios en lib/db/schema.ts
npm run db:migrate        # aplicar migraciones pendientes a la base configurada en DATABASE_URL
npm run db:studio          # explorador visual de la base (Drizzle Studio)
npm run db:seed             # crear/actualizar el usuario admin (usa SEED_ADMIN_EMAIL/PASSWORD)
```

## Despliegue

- **Vercel:** hosting del frontend, Server Components, Route Handlers y
  Server Actions. Preview deployments automáticos por PR/branch.
- **Neon:** base de datos Postgres. Confirmar que `DATABASE_URL` en Vercel
  apunte al branch correcto de Neon (prod vs. desarrollo).
- **Vercel Blob:** un store por proyecto (`store_TQOXSBd82945TTXP` en este
  caso). El token `BLOB_READ_WRITE_TOKEN` debe estar tanto en `.env.local`
  (desarrollo local) como en las Environment Variables de Vercel
  (producción) — confirmado configurado en ambos lugares.

No hay Render ni ningún otro servicio adicional — decisión explícita
documentada en `ROADMAP.md` (sin necesidad técnica todavía).
