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

Hoy el catálogo tiene 6 categorías de primer nivel: **Impresión** (con
subcategorías Escritorio, Industriales, Tarjetas e Impresoras RFID),
**Movilidad**, **Captura de Datos**, **RFID**, **Consumibles** (con
subcategorías Ribbons, Etiquetas, Etiquetas RFID y Repuestos y Accesorios)
e **Identificación / Biometría**.

> ⚠️ **Una categoría "Publicada" sin productos publicados no se muestra en
> el sitio** (ni en Home, ni en el menú, ni en las pills de categorías del
> catálogo) — aunque su Estado diga Publicado. Esto es automático: apenas
> cargues y publiques el primer producto de esa categoría, va a aparecer
> sola. Es intencional, para no mostrar secciones vacías al público (ej.
> "Identificación / Biometría" hoy está oculta por esto). Si necesitás
> verla igual, entrá directo por su URL (`/catalogo/<slug>`) — solo no
> aparece en la navegación.

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

**Dónde se ven las relaciones en la ficha del producto:** las de tipo
Accesorio y Compatible aparecen como "Complementá tu solución" en el equipo,
y al revés como "Compatible con" en el accesorio. Las de tipo Relacionado
aparecen como "Productos relacionados". "También puede interesarte" se arma
solo con otros equipos publicados de la misma categoría. Un producto
vinculado que sigue en Borrador no se muestra hasta que lo publiques.

### SKU, precio y stock

El formulario del panel no tiene campos de SKU, precio ni costo. Esos datos
se cargan desde el Excel de precios (columnas `sku`, `titulo`,
`precio_valor1` = costo, `precio_valor2` = precio de lista, `cantidad`) y
quedan guardados en dólares. **Los precios no se muestran en el sitio.** El
stock sí: cambiá **Disponibilidad** en el producto cuando algo se agota.

### Cómo escribir las especificaciones

Los filtros del catálogo, el comparador y el selector de insumos leen las
especificaciones, así que conviene usar siempre los mismos nombres de
característica:

| En | Usá esta etiqueta | Ejemplo de valor |
|---|---|---|
| Impresoras | `Método de impresión` | Térmica directa y transferencia térmica |
| Impresoras | `Resolución` | 203 dpi |
| Impresoras | `Conectividad` (o `Puertos`, `Interfaz`) | USB 2.0, Ethernet, Bluetooth |
| Impresoras, para el selector | `Ancho de etiqueta` (o `Ancho de medio`) | 20 a 112 mm |
| Impresoras, para el selector | `Ancho de ribbon`, `Largo máximo de ribbon` o `Cinta (ribbon)` | 51 mm a 110 mm / 450 m / Hasta 300 m, núcleo 1" |
| Lectores | `Tipo` | Imager 1D/2D |
| Ribbons | `Tipo`, `Color`, `Ancho`, `Largo`, `Diámetro de core`, `Enrollado` | Resina Premium / Negro / 110 mm / 74 m / 1" (25.4 mm) / OUT |
| Etiquetas | `Material`, `Color`, `Ancho`, `Alto`, `Diámetro de core` | OPP (polipropileno) / Blanco / 100 mm / 63 mm / 40 mm |

Si una característica se escribe distinto, el producto no aparece en ese
filtro y el selector de insumos no lo puede verificar. Escribí las medidas
en milímetros y con unidad.

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

### Pedidos con varios productos

Cuando un cliente arma su **lista de cotización** en el sitio y la envía,
llega como **una sola consulta** de tipo Cotización. El detalle va en el
mensaje, una línea por producto con su cantidad y el link a la ficha
("3 x Zebra ZT411 (...)"). La cantidad de productos aparece en el campo
Cantidad. Si el cliente prefirió enviar la lista por WhatsApp, no pasa por
esta pantalla: te llega directo al WhatsApp.

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
