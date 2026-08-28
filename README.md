# TodoCodigoDeBarras

Sitio web corporativo + catálogo + generación de leads para una empresa que
comercializa hardware de captura automática de datos (códigos de barras,
RFID) e insumos asociados. Fase 1: sin venta online. El modelo de datos y la
arquitectura están preparados para evolucionar a e-commerce en Fase 2.

## Documentación del proyecto

- **[docs/ROADMAP.md](docs/ROADMAP.md)** — fuente de verdad del estado del
  proyecto: qué fase está en curso, qué está hecho y qué falta. Leer esto
  primero si se retoma el proyecto después de un corte.
- **[docs/FICHA-TECNICA.md](docs/FICHA-TECNICA.md)** — stack, arquitectura,
  modelo de datos, seguridad, variables de entorno y despliegue.
- **[docs/MANUAL-USUARIO.md](docs/MANUAL-USUARIO.md)** — cómo usar el panel
  de administración (`/admin`) para cargar productos, categorías, marcas y
  gestionar consultas, sin tocar código.

## Empezar en local

```bash
npm install
cp .env.example .env.local   # completar las variables (ver ficha técnica)
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). El panel de
administración vive en `/admin`.

## Seguridad

Se hizo una auditoría de seguridad completa. Estado:

**Corregido:**
- Rate limiting en `/admin/login` (bloquea después de 5 intentos fallidos
  por IP en 15 minutos).
- JSON-LD escapado antes de inyectarse en el HTML (evita que un valor con
  `</script>` rompa la página).

**Pendiente (severidad media/baja, no bloqueante para uso normal):**
- Login sin protección contra enumeración de usuarios por timing.
- Subida de imágenes/documentos sin validar tipo de archivo ni tamaño
  máximo explícito.
- Vulnerabilidad moderada de `esbuild` vía `drizzle-kit` (solo afecta el
  entorno de desarrollo local, no producción).
- Sesión de admin sin mecanismo de revocación server-side antes de su
  expiración (7 días).
- CSP usa `'unsafe-inline'` en `script-src` y `style-src` (decisión
  deliberada: un nonce dinámico por request rompía la hidratación en
  páginas con ISR/cache — ver `docs/FICHA-TECNICA.md`). Alternativa futura
  si hace falta más dureza: excluir del caché las rutas que necesiten
  nonce, o usar CSP basada en hash.
- Nombre de archivo sin sanitizar en la key de Vercel Blob.

Detalle completo de cada punto (archivo, línea, riesgo, cómo corregirlo) en
`docs/FICHA-TECNICA.md`.
