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

---

## Actualización — investigación de fotos/fichas técnicas (28 SKUs)

Pediste que busque fotos y fichas técnicas para el listado de SKUs que me
pasaste (impresoras, lectores, RFID). Se investigó cada uno contra fuente
oficial (igual nivel de rigor que el piloto original), se verificó cada
URL con HTTP antes de usarla, y se cargaron **27 fotos reales** y **17
fichas técnicas** en Vercel Blob, más las specs correspondientes. Todo
sigue en **Borrador** — no se publicó nada.

**3 productos sin foto** (no inventé ninguna imagen genérica):
- **1169** (Etiqueta RFID Z-Perform 2000D) — es una línea real de Zebra,
  pero no hay foto específica del SKU exacto (47x32mm/3500) verificable.
- **4099** (Impresora Honeywell PC42e-T) y **4100** (Tablet Honeywell
  EDA10) — no se encontró foto oficial de Honeywell verificable en esta
  sesión, solo la ficha técnica.

**Cosas puntuales para tu revisión:**

- **SKU 4100 "Tablet Honeywell EDA10"** — no existe un modelo "EDA10"
  independiente en la documentación de Honeywell, solo **"ScanPal
  EDA10A"**. Es casi seguro que sea el mismo producto con el nombre
  abreviado en tu excel. **No renombré el producto** — dejé una nota en
  sus specs ("Modelo real (a confirmar): Honeywell ScanPal EDA10A") para
  que decidas vos si corresponde corregir el nombre.
- **SKU 4034 (Zebra DS7708) y 4061 (Zebra TC26)** — están **discontinuados
  por Zebra** (última venta sep. 2024 y feb. 2025 respectivamente, aunque
  con soporte hasta 2028-2029). Siguen siendo productos reales y
  vendibles como stock remanente, pero quizás no quieras presentarlos
  como "nuevo" sin aclarar. La foto del TC26 además es de baja resolución
  (300x300, la única oficial que encontré).
- **SKU 4003 "Uniform ST8310"** — confirmé que "Uniform" es una marca real
  (UIC - Uniform Industrial Corporation, línea Scanteam), así que quedó
  con marca asignada. No se encontró ficha técnica oficial descargable.
- **SKU 4038 "MJ 6709"** — se remonta a Alacrity/Symcode (fabricante OEM
  chino); "MJ" en sí no es una marca independiente confirmada, parece ser
  una designación de reventa. Dejé la foto (del sitio del fabricante real,
  Alacrity) pero sin asignar marca en la base.
- **SKUs 4077/4078 y 4083** (Kit RFID / RFD40 Standard / RFD40 Premium) —
  comparten la misma foto porque Zebra no publica fotografías distintas
  para las variantes Standard vs Premium del mismo mango RFID.
- **SKUs 4090 (ZD220t) y 4060 (ZD230t)** — comparten foto por ser la misma
  familia/carcasa Zebra.
- **SKUs 4101 y 4106** (Zebra ZD421 USB vs USB+Ethernet) — comparten foto
  por el mismo motivo.
- **SKU 4082 (TSC RFID T820)** — la foto es genérica de la serie T800
  (compartida con el T830), no específica del T820.

Nada de esto está publicado — queda todo en Borrador para tu revisión
final antes de que se vea en el sitio.
