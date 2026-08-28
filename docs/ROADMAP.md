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

- **Headers de seguridad:** CSP estricta con nonce dinámico por request
  (`proxy.ts` — necesario porque Next.js inyecta scripts inline para
  hidratar RSC; una CSP estática sin nonce rompe la app por completo,
  verificado en `npm run start`) + `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` en
  `next.config.ts`.
- **OG image fallback:** `app/opengraph-image.tsx`, generada con
  `next/og` (sin assets externos), se usa automáticamente cuando una
  página no define su propia imagen (ej. producto sin fotos).

**Pendiente:**
1. Checklist de producción: confirmar `NEXT_PUBLIC_SITE_URL` en Vercel
   (prod vs preview — hoy cae al fallback de `VERCEL_URL` si no está
   seteada). Necesita el dominio real, no se puede resolver sin ese dato.

**Explícitamente fuera de alcance en 1G:** Render (sigue sin razón técnica),
CAPTCHA (honeypot + rate limiting alcanza), cambios al modelo de datos de
producto (eso quedó documentado como P0 de Fase 1H, abajo).

### Fase 1H — Auditoría AIDC (SEO/AEO/GEO + arquitectura de catálogo) — 🔄 En curso

Auditoría completa entregada como artifact (equipo Technical SEO + AEO/GEO +
Information Architect + CRO). El roadmap completo (con archivos afectados)
vive en el informe; acá el resumen para no tener que reabrirlo:

**Hecho:**
- **Carga masiva desde Excel (piloto):** modelo de producto extendido con
  `sku`, `price`, `cost_price` (interno, no se muestra en ningún lado
  público todavía) y `currency` (default `USD`, confirmado con el usuario)
  — migración `drizzle/0005_redundant_stranger.sql` aplicada en Neon, con
  índice único en `sku`. Se cargó un piloto de 14 SKUs desde
  `tcb-280826.xlsx` (157 filas totales, resto pendiente hasta validar este
  piloto): los 5 productos ya existentes se actualizaron con su sku/precio/
  disponibilidad real, y se sumaron 9 productos nuevos — 3 insumos
  genéricos sin marca (rollo de etiquetas OPP, ribbon de resina, etiqueta
  RFID — specs parseadas del título, sin foto por no tener marca) y 6
  productos de marca con specs, foto y ficha técnica reales investigadas en
  la web oficial del fabricante (Epson TM-T20III, Topaz T-LBK750-BHSB-R,
  Zebra ZC100, Honeywell EDA52, Bluebird RFR901). El repuesto Zebra ZT420
  (cabezal térmico) se cargó sin foto ni ficha — no se encontró una fuente
  oficial de Zebra para ninguna de las dos, incluida a propósito la debilidad
  del dato en vez de usar una imagen de un reseller. Marcas nuevas creadas:
  Epson, Topaz, Honeywell, Bluebird. Categorías nuevas: Impresoras >
  Tarjetas, Insumos y Consumibles > Etiquetas RFID e Insumos y Consumibles >
  Repuestos y Accesorios. Precio cargado pero sin mostrar en ninguna página
  pública (decisión del usuario, ver P1 de `Offer` en JSON-LD abajo).
- Catálogo real cargado (contenido, no código — vía scripts puntuales
  contra Neon, no viven en el repo): marcas **Zebra** y **TSC** (publicadas);
  5 categorías top-level — **Impresoras** (con subcategorías Escritorio e
  Industriales), **Computadoras móviles**, **Escáneres de códigos de
  barras**, **RFID** e **Insumos y Consumibles** (con subcategorías Ribbons
  y Etiquetas). **11 productos publicados**, todos con specs técnicas reales
  de datasheets oficiales y ficha técnica enlazada como documento
  descargable:
  - Zebra: **ZT411** (impresora industrial), **TC22** (cómputo móvil),
    **DS2208** (escáner), **FX9600** (lector RFID fijo), **2300 Wax** y
    **5095 Resin** (ribbons), **Z-Select 4000D** (etiqueta térmica directa)
  - TSC: **TE200**, **TE210** (impresoras de escritorio), **MB241T**,
    **MH241T** (impresoras industriales)
  10 de los 11 tienen foto real del fabricante (autorización del usuario:
  partner de Zebra y empleado de TSC) subida a Vercel Blob. La Z-Select
  4000D quedó **sin foto a propósito** — no se pudo confirmar con certeza
  la URL de imagen del SKU exacto (rollo de etiqueta, no el de recibo) y
  se prefirió no usar una imagen que pudiera representar mal el producto.
  `BLOB_READ_WRITE_TOKEN` estaba vacío en `.env.local` (store de Vercel
  Blob nunca conectado) — se configuró con el store real del proyecto
  (`store_TQOXSBd82945TTXP`) y el usuario confirmó que la misma variable
  ya está cargada en Settings → Environment Variables del proyecto en
  Vercel (production) — el admin puede subir imágenes nuevas desde el
  sitio desplegado.
  No se cargó ninguna relación `compatible` ribbon↔etiqueta todavía: la
  Z-Select 4000D es térmica directa (no usa ribbon), así que vincularla
  con los ribbons sería una afirmación técnica incorrecta. Falta cargar
  una etiqueta sintética apta para transferencia térmica para poder armar
  esa relación de verdad.
- Tarjetas de categoría con ícono en Home (`components/layout/category-icon.tsx`),
  idea tomada de barcodesinc.com — reemplaza las tarjetas de solo texto.
- Fix de contraste: `--color-border` era casi idéntico a `--color-muted`,
  los inputs de formulario eran invisibles hasta el foco. Corregido en
  `app/globals.css` + `bg-white` explícito en inputs
  (`components/forms/inquiry-form.tsx`, `components/admin/form-styles.ts`).
- **P0 — modelo de producto extendido:** `mpn`, `condition`
  (new/refurbished/used), `availability` (in_stock/out_of_stock/preorder/
  discontinued) en `products`, y valor `compatible` agregado a
  `relationship_type` (antes solo `related`/`accessory`). Migración
  aplicada en Neon, conectado a formulario admin, validación Zod y JSON-LD
  de producto (`mpn`). Sin `Offer` todavía — sigue bloqueado por la
  decisión de política de precios (ver P1 abajo).
- **P1 — cantidad/volumen en leads:** columna `inquiries.quantity`
  (texto libre: "2 cajas", "500 unidades"), conectada a formulario público,
  validación, notificación por email y tabla de admin.
- **P1 — `FAQPage` técnico:** helper `faqPageJsonLd` en `lib/seo/jsonld.ts`
  + componente `CategoryFaq`, aplicado en las 6 categorías con contenido.
  Contenido factual sobre estándares de la industria (dpi, térmica directa
  vs. transferencia, ribbon cera/cera-resina/resina, IP rating,
  MIL-STD-810H, lector 1D vs. 2D, RFID UHF vs. HF, EPC Gen2) — deliberadamente
  sin afirmaciones sobre el negocio, solo definiciones técnicas verificables.
- **P1 — hub de Recursos Técnicos** (`/recursos`): lista fichas técnicas y
  manuales de productos publicados, agrupados por marca, derivado de
  `product_documents` (dato real ya cargado, no fabricado). Enlazado desde
  el footer y el sitemap.

- **Sprint de optimización B2B (pre-publicación):**
  - **Fix crítico de catálogo:** `getCatalogProducts` (`features/products/queries.ts`)
    filtraba por igualdad exacta de `categories.slug`, pero los productos
    cuelgan de la *subcategoría* (ej. "Industriales"), no de la categoría
    top-level ("Impresión") — por eso `/catalogo/impresion` devolvía 0
    resultados aunque hubiera productos. Ahora resuelve la categoría pedida
    + sus hijas directas y filtra por `inArray(categoryId, [...])`.
  - **Rediseño de Hero (Home):** mismo título/subtítulo, pero ahora con
    fondo real (`warehouse-hero.jpg`) + overlay oscuro (45%) y una
    composición 2×2 con fotos reales de producto (impresora ZT411, escáner
    DS2208, cómputo móvil TC22, lector RFID FX9600) en vez de solo texto —
    sin generar imágenes nuevas, reusa fotos ya cargadas del catálogo.
  - **Categorías reestructuradas** para escalar: Impresoras→**Impresión**,
    Escáneres→**Captura de Datos**, Computadoras móviles→**Movilidad**,
    Insumos y Consumibles→**Consumibles**, RFID sin cambios. Se agregó
    **Identificación / Biometría** (categoría nueva, vacía, para cuando haya
    productos de esa línea) y la subcategoría **Impresoras RFID** dentro de
    Impresión (también vacía, para impresoras/codificadoras RFID a futuro).
    Slugs cambiaron — sin problema porque el sitio no está publicado
    todavía; si ya estuviera indexado habría que agregar redirects.
  - **Diferencial B2B** (asesoramiento técnico, stock y disponibilidad,
    soporte post-venta) pasó de ser un detalle chico dentro del hero oscuro
    a su propia sección en tarjetas, inmediatamente debajo del hero.
    Reemplaza a `components/layout/trust-badges.tsx` (eliminado, quedó sin
    uso).
  - **"Soluciones por Industria":** bloque nuevo en Home + dropdown
    "Soluciones" en el header (desktop con hover, mobile como submenú) +
    5 páginas nuevas `/soluciones/[slug]` (Logística y Depósitos, Retail y
    Punto de Venta, Manufactura e Industria, Salud y Laboratorios, Control
    de Activos) con `generateStaticParams`, breadcrumb JSON-LD y entrada en
    el sitemap. Contenido (título + descripción corta) provisto
    directamente por el cliente en `lib/content/industry-solutions.ts` — no
    inventado, así que no aplica la reserva de "inventar capacidades" que
    tenía este ítem antes.
  - **CTAs de producto:** "Solicitar cotización" / "Consultar por
    WhatsApp" pasaron a ser 3 botones — "Solicitar cotización por volumen",
    "Consultar asesoramiento técnico" (ambos scrollean al formulario) y
    "Contactar por WhatsApp" — más explícitos para B2B. El selector de
    Cantidad/Volumen en el formulario de consulta ya existía de antes.
  - **Pendiente de este sprint:** reemplazar el logo del header por un
    archivo `public/logo.svg` (monograma TCB circuito/RFID) — el usuario lo
    mencionó como "ya cargado" pero el archivo no existe en el repo, así
    que el header sigue usando el `LogoMark` SVG hecho a mano que ya había.

**Pendiente — P0:**
- ~~Reemplazar el copy placeholder de Home y Empresa~~ — **hecho
  parcialmente**: el usuario confirmó que la empresa opera desde 1992, así
  que el párrafo institucional (Home teaser, Empresa y la tarjeta
  "Trayectoria comprobada") ya menciona ese dato real en vez del genérico
  anterior. Sigue sin certificaciones ni diferenciales adicionales
  verificables — el usuario confirmó que por ahora no hay más para agregar.
- Definir NAP real (dirección, teléfono, horario) y agregar `LocalBusiness`
  junto al `Organization` existente — hoy no hay ningún dato de contacto
  físico en el sitio.
- Seguir completando el catálogo: validar el piloto de 14 SKUs con el
  usuario y, si está bien, seguir con el resto de las ~143 filas restantes
  de `tcb-280826.xlsx`; cargar productos reales en Identificación/Biometría
  e Impresoras RFID (hoy vacías), más SKUs por categoría, al menos una
  etiqueta sintética compatible con transferencia térmica (para poder
  cargar la relación `compatible` con los ribbons ya cargados).

**Pendiente — P1:**
- `Offer` en el JSON-LD de producto (requiere antes decidir política de
  precios: ¿mostrar precio o siempre "consultar"?).
- Las 5 páginas de `/soluciones/[slug]` (`lib/content/industry-solutions.ts`)
  hoy son muy flacas (título + una línea + 2 botones). Decisión del usuario:
  no es prioridad ahora, pero cuando se retome **no** desarrollarlas como
  "soluciones" genéricas — el sitio vende hardware, no servicios de
  consultoría. Reencuadrarlas como casos de éxito/uso concretos (ej. "así
  resolvimos trazabilidad de depósito con RFID", con el hardware real
  involucrado), no como propuesta de solución abstracta.
- Ruta "Servicio Técnico" — sigue sin existir ni como página ni como
  categoría especial (a diferencia de "Soluciones por Industria", esto
  todavía requiere confirmar qué servicio técnico ofrece realmente el
  negocio).

**P2/P3:** guías técnicas (TechArticle/HowTo), página de aterrizaje por
datasheet (hoy los PDF cuelgan sueltos, link directo al blob — el hub de
`/recursos` es un paso intermedio, no reemplaza esto), buscador de
compatibilidad insumo↔impresora, comparador de specs.

**Ideas de diseño (referencia: barcodesinc.com, competidor de referencia en
hardware AIDC B2B)** — para aplicar cuando se rediseñe Home/catálogo:
- Grilla de categorías con ícono — **ya implementado** (ver arriba).
- Sellos de garantía/confianza arriba del fold — **ya lo tenemos** vía la
  sección de Diferencial B2B en Home, solo falta contenido 100% confirmado
  (hoy es genérico, no cifras/certificaciones reales).
- "Buscador de compatibilidad" (insumo↔impresora) como herramienta destacada,
  no solo un filtro más — coincide con el P3 de arriba.
- Centro de recursos en el footer — **ya lo tenemos** vía `/recursos`
  (queda como P2 sumar generador de códigos y guías de selección).
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
