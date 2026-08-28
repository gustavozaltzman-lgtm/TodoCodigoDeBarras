# Manual de usuario — Panel de administración

> Guía para cargar y mantener el contenido del sitio sin tocar código. Para
> el estado general del proyecto ver [ROADMAP.md](ROADMAP.md); para detalle
> técnico ver [FICHA-TECNICA.md](FICHA-TECNICA.md).

## Cómo entrar

Entrá a `/admin` de tu sitio (por ejemplo `https://tu-dominio.com/admin`).
Te va a pedir email y contraseña. Si te equivocás la contraseña varias
veces seguidas, el sistema bloquea los intentos por unos minutos por
seguridad — es normal, esperá y volvé a intentar.

Al entrar vas a ver el **Dashboard**, con 4 accesos directos: Productos,
Categorías, Marcas y Consultas nuevas.

## Conceptos clave

### Estado de publicación

Productos, categorías y marcas tienen un **Estado** con 4 valores:

| Estado | Qué significa |
|---|---|
| **Borrador** | Está cargado pero no se ve en el sitio público todavía. Usalo mientras estás completando la ficha. |
| **Publicado** | Visible en el sitio para cualquier visitante. |
| **Oculto** | Sigue existiendo en el sistema pero no aparece públicamente — útil para sacar algo de circulación temporalmente sin perder la carga. |
| **Archivado** | Ya no está activo, pero se conserva la información. |

No hace falta borrar nada para dejar de mostrarlo — con cambiar el estado alcanza.

### Slug

Es la parte de la URL (ej. `zebra-zt411` en `/productos/zebra-zt411`). Se
genera solo a partir del nombre, pero podés editarlo a mano. Evitá cambiar
el slug de algo ya publicado — rompe el link si alguien lo tenía guardado
o compartido.

## Marcas

`/admin/marcas` → **+ Nueva marca**

Campos: Nombre, Slug, URL del logo (opcional), Descripción, Estado, Orden
(número — menor = aparece primero en las listas).

## Categorías

`/admin/categorias` → **+ Nueva categoría**

Campos: Nombre, Slug, Categoría padre (opcional — dejalo vacío para que
sea una categoría de primer nivel, o elegí una para que sea subcategoría),
Descripción, Imagen, Estado, Orden, SEO Title, SEO Description.

Hoy el catálogo tiene 5 categorías de primer nivel: **Impresoras**
(con subcategorías Escritorio e Industriales), **Computadoras móviles**,
**Escáneres de códigos de barras**, **RFID** e **Insumos y Consumibles**
(con subcategorías Ribbons y Etiquetas).

## Productos

`/admin/productos` → **+ Nuevo producto**

### Datos básicos
Nombre, Slug, Marca, Categoría, Modelo, **MPN** (número de parte del
fabricante — útil para que Google identifique el producto exacto),
Descripción corta (se usa en las tarjetas de listado), Descripción
completa.

### Condición y disponibilidad
- **Condición:** Nuevo / Reacondicionado / Usado.
- **Disponibilidad:** En stock / Sin stock / A pedido / Discontinuado.

### Estado, orden y destacado
Igual que en marcas/categorías, más el check **"Producto destacado"** —
los productos destacados son los que aparecen en la sección "Productos
destacados" de la Home.

### SEO Title / SEO Description
Opcionales. Si los dejás vacíos, el sitio usa el nombre y la descripción
corta del producto.

### Después de guardar: fichas adicionales

Al editar un producto ya creado (`/admin/productos/[id]`) aparecen
secciones extra:

- **Imágenes:** subís archivos, marcás cuál es la principal (se muestra
  primero en la galería), y podés borrar. Poné un texto alternativo (ALT)
  descriptivo — ayuda a SEO y accesibilidad.
- **Especificaciones técnicas:** tabla de característica/valor, agrupable
  (ej. grupo "Impresión", "Conectividad", "Físico"). Es lo que se muestra
  como tabla de specs en la página del producto.
- **Documentos:** fichas técnicas, manuales u otros PDF. Elegí el tipo,
  ponele un título y subí el archivo — queda como link descargable en la
  ficha del producto y en `/recursos`.
- **Productos relacionados:** vinculá con otro producto del catálogo como
  "Relacionado", "Accesorio" o **"Compatible"** (este último es para
  insumos: por ejemplo, un ribbon compatible con una etiqueta o impresora
  específica — usalo solo cuando la compatibilidad sea real, no como
  relación genérica).

### Listado y acciones masivas

En `/admin/productos` podés tildar varios productos y cambiarles el estado
a todos juntos (por ejemplo, publicar 10 productos de una vez) con el
selector que aparece arriba de la tabla al seleccionar.

## Consultas (leads)

`/admin/consultas` muestra todas las consultas recibidas por el formulario
del sitio: fecha, tipo (general / cotización / producto), datos de
contacto, mensaje (con la cantidad/volumen si el cliente la indicó), y un
selector de estado (**Nueva** / **Contactado** / **Cerrado**) para hacer
seguimiento. También llega una notificación por email a la casilla
configurada apenas entra una consulta nueva.

## Buenas prácticas

- Cargá un producto como **Borrador** hasta tener al menos una foto real y
  las specs principales — publicalo recién cuando esté completo.
- Usá fotos reales del fabricante o propias — nunca capturas de pantalla
  ni imágenes de baja resolución.
- El **MPN** y las **especificaciones técnicas** son lo que más ayuda a que
  Google y los buscadores de IA encuentren y recomienden el producto — no
  te quedes solo con la descripción corta.
- Si vas a cargar muchos productos de una vez, cargalos como Borrador,
  revisalos, y publicalos en bloque desde el listado cuando estén listos.
