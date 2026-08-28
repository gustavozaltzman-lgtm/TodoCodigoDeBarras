# Log — carga nocturna del catálogo (2026-08-28)

> Generado automáticamente para revisar mañana. Resume qué se cargó, qué
> decisiones tomé sin poder consultarte, y qué necesita tu revisión antes
> de publicar nada. No se tocó ningún commit de código sin avisar — esto
> es solo el resumen de la carga de datos en Neon.

## Qué se cargó

Las 131 filas restantes de `tcb-280826.xlsx` (de las 157 totales — 14 ya
habían entrado en el piloto, 12 quedaron excluidas). Todo entró como
**Borrador** (`status = draft`), no público todavía — siguiendo la
recomendación del propio manual de usuario ("si vas a cargar muchos
productos de una vez, cargalos como Borrador, revisalos, y publicalos en
bloque"). Nada de esto se ve en el sitio hasta que lo publiques desde
`/admin/productos`.

Estado final de la base: **151 productos** (20 publicados de antes, 131
borradores nuevos). Sin slugs ni SKUs duplicados (verificado).

Se crearon 3 marcas nuevas (sin logo todavía, igual que estaban las demás
antes de que les subiera uno): **Unitech**, **Fargo**, **DigitalPersona**.

Distribución por categoría de los 131 nuevos (aproximado, incluye lo que
ya había):

- Etiquetas: 55
- Ribbons: 26
- Repuestos y Accesorios: 19
- Captura de Datos: 12
- Escritorio: 11
- Movilidad: 6
- Etiquetas RFID: 5
- RFID: 5
- Industriales: 4
- Identificación / Biometría: 3 (¡ya tiene contenido real! ver abajo)
- Tarjetas: 2
- Impresoras RFID: 1
- Impresión (sin subcategoría): 1
- Consumibles (sin subcategoría): 1

## Lo que NO se hizo (importante)

**No busqué fotos ni fichas técnicas para estos 131 productos.** Para el
piloto de 9 productos SÍ hice esa investigación uno por uno (fuente
oficial del fabricante, verificada). Para 131 productos en una sola
sesión no es viable hacer ese mismo nivel de investigación sin
supervisión — así que prioricé cargar los datos reales del Excel (SKU,
precio, stock, categoría) y dejar todo en Borrador para que decidas cómo
seguir: ¿los publicamos así (solo texto, sin foto) para algunos, buscamos
fotos en tandas por categoría, o los dejás en borrador hasta tener fotos
propias?

**Los nombres y specs de los 131 productos son generados, no verificados
contra ficha oficial del fabricante** (salvo los datos que ya venían en
el Excel: SKU, precio, stock). Para los rollos de etiquetas y ribbons
parseé el título del Excel con reglas automáticas (ej. "ROLLO ETIQ OPP BL
100x63/500 B40" → Material OPP, Color Blanco, Ancho 100mm, Alto 63mm, 500
por rollo, core 40mm) — deberían ser correctos porque siguen la
convención de esos títulos, pero no los verifiqué producto por producto.

## Cosas puntuales que necesitan tu ojo

1. **SKU 4003 y 4038** — marcas "Uniform" y "MJ" no las reconocí con
   certeza como marcas reales (podrían ser nombres genéricos/locales, no
   marcas de fábrica), así que quedaron sin marca asignada. Revisar.
2. **SKU 4022** (Lector 1D Honeywell 1200 USB) y **SKU 5079** (Cabezal
   Térmico Zebra ZT411) — en el Excel tienen precio y stock en 0/nulo,
   lo que sugiere que podrían estar discontinuados. Los cargué igual
   (como Sin Stock) pero probablemente no valga la pena publicarlos.
3. **SKU 2003, 2004, 2005, 2007** ("POL BLANCA 710...") — no tengo
   certeza de qué material es "POL" exactamente (¿poliamida?
   ¿polipropileno?). Los categoricé en Ribbons por las dimensiones
   (ancho x metros, igual que los otros ribbons), pero el nombre del
   producto quedó genérico ("Rollo POL Blanca 710...") — necesito que me
   digas qué es realmente para poder nombrarlo y categorizarlo bien.
4. **SKU 4110** (Impresora Portátil Zebra ZQ521) — no hay subcategoría
   para impresoras portátiles todavía, quedó en Impresión (nivel
   superior) directamente. Si van a cargar más impresoras portátiles,
   convendría crear la subcategoría.
5. **SKU 5049** (Tarjeta PVC Blanca) — mismo caso, no hay subcategoría
   para insumos de impresoras de tarjetas (PVC en blanco). Quedó en
   Consumibles directamente.
6. **SKU 5003** ("IMPRESION DE ETIQUETAS", sin precio) — lo excluí de la
   carga porque parece una línea de servicio (imprimir etiquetas como
   servicio), no un producto físico. Si en realidad es un producto,
   avisame y lo cargo.
7. **SKU 1151** — el título tenía un formato distinto al resto ("Rollo
   Etiq Ilustracion BL 100x99 500 1 B B40", sin barra `/` antes de la
   cantidad) y mi parser automático no lo leyó bien la primera vez; lo
   corregí a mano, pero por las dudas revisá que "Rollo de Etiquetas
   Papel Ilustración Blanco 100x99mm x500" esté bien.
8. **Producto Topaz T-LBK750-BHSB-R** (el del piloto) lo recategoricé de
   "Repuestos y Accesorios" a "Identificación / Biometría", para que
   quede junto al Topaz S461 nuevo — antes de esta carga no había otro
   pad de firma con el que agrupar.

## Lo que sigue pendiente de la review anterior (sin tocar esta noche)

- Placeholders legales `[Completar: razón social, CUIT y domicilio
  legal]` en `/privacidad` y `/terminos` — sigo necesitando esos datos
  reales tuyos.
- 🟠 Prioridad 2 de tu último pedido (comparador de productos, fichas con
  "ideal para/no recomendado", landing de soluciones con equipos
  recomendados, etc.) — no arranqué nada de esto, quedó tal cual lo
  dejamos.

## Cómo seguir mañana

1. Entrá a `/admin/productos`, filtrá por Borrador, y revisá en bloque.
2. Los que ya se vean bien (nombre correcto, precio correcto) los podés
   publicar tal cual sin foto — o esperar a tener fotos.
3. Contame las respuestas a los puntos 1-6 de arriba y los ajusto.
