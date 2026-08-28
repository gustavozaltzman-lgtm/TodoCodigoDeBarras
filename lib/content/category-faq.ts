import type { FaqItem } from "@/lib/seo/jsonld";

// Contenido tecnico factual (definiciones de la industria AIDC), no
// afirmaciones sobre el negocio. Pensado para AEO/GEO: respuestas directas
// que un motor de busqueda o una IA pueda citar.
export const CATEGORY_FAQ: Record<string, FaqItem[]> = {
  impresoras: [
    {
      question: "¿Qué significa la resolución (dpi) de una impresora de etiquetas?",
      answer:
        "Los dpi (puntos por pulgada) indican la densidad de puntos que el cabezal de impresión puede colocar en una pulgada lineal. A mayor dpi, mayor nitidez para textos pequeños y códigos de barras densos. 203 dpi es el estándar más común; 300 y 600 dpi se usan para etiquetas con letra muy pequeña o códigos 2D exigentes.",
    },
    {
      question:
        "¿Cuál es la diferencia entre impresión térmica directa y por transferencia térmica?",
      answer:
        "La impresión térmica directa usa papel químicamente tratado que se oscurece con el calor del cabezal, sin necesidad de ribbon, pero la imagen se degrada con la luz y el calor con el tiempo. La transferencia térmica usa un ribbon (cera, cera-resina o resina) cuya tinta se transfiere a la etiqueta con calor, produciendo etiquetas más durables y resistentes a la abrasión, la humedad y los químicos.",
    },
    {
      question:
        "¿Cuándo conviene usar un ribbon de cera, cera-resina o resina?",
      answer:
        "El ribbon de cera es el más económico y sirve para etiquetas de papel en aplicaciones internas de corta duración. El cera-resina ofrece mejor resistencia a la abrasión y se usa en etiquetas sintéticas o que requieren mayor durabilidad. El de resina pura es el más resistente a químicos, calor y fricción, y se usa en etiquetado industrial exigente.",
    },
  ],
  "impresoras-escritorio": [
    {
      question: "¿Cuándo conviene una impresora de escritorio en vez de industrial?",
      answer:
        "Las impresoras de escritorio están pensadas para volúmenes bajos o medios (hasta unos cientos de etiquetas por día) y espacios reducidos como mostradores u oficinas. Si el volumen diario es alto o la operación es continua en varios turnos, conviene una impresora industrial, con mecanismo metálico y mayor capacidad de rollo.",
    },
    {
      question: "¿Qué significa la resolución (dpi) de una impresora de etiquetas?",
      answer:
        "Los dpi (puntos por pulgada) indican la densidad de puntos que el cabezal de impresión puede colocar en una pulgada lineal. A mayor dpi, mayor nitidez para textos pequeños y códigos de barras densos. 203 dpi es el estándar más común para uso general.",
    },
  ],
  "impresoras-industriales": [
    {
      question: "¿Qué diferencia a una impresora industrial de una de escritorio?",
      answer:
        "Las impresoras industriales están construidas con mecanismos metálicos (no plástico), soportan mayores volúmenes de impresión diarios, aceptan rollos de mayor diámetro y suelen ofrecer más opciones de conectividad y accesorios (cortador, rebobinador, pelador). Están pensadas para operar en turnos prolongados sin degradar la calidad de impresión.",
    },
    {
      question:
        "¿Cuál es la diferencia entre impresión térmica directa y por transferencia térmica?",
      answer:
        "La impresión térmica directa usa papel químicamente tratado que se oscurece con el calor del cabezal, sin necesidad de ribbon, pero la imagen se degrada con el tiempo. La transferencia térmica usa un ribbon cuya tinta se transfiere a la etiqueta con calor, produciendo etiquetas más durables y resistentes a la abrasión y los químicos — la opción habitual en entornos industriales.",
    },
  ],
  "computadoras-moviles": [
    {
      question:
        "¿Qué significa el rating IP (por ejemplo IP65 o IP68) en un equipo móvil?",
      answer:
        "El rating IP (Ingress Protection) indica el grado de protección contra sólidos y líquidos. El primer dígito indica protección contra polvo (0 a 6) y el segundo contra agua (0 a 9). Un IP65 protege completamente contra polvo y contra chorros de agua; un IP68 agrega resistencia a la inmersión temporal. En logística y depósito se recomiendan equipos con al menos IP65.",
    },
    {
      question: "¿Qué significa que un equipo cumple MIL-STD-810H?",
      answer:
        "Es un estándar militar estadounidense de pruebas ambientales (caídas, vibración, temperatura extrema, humedad) que fabricantes como Zebra usan para certificar la resistencia de sus equipos rugerizados. No garantiza indestructibilidad, pero sí un nivel de resistencia muy superior al de un dispositivo de consumo estándar.",
    },
  ],
  "escaneres-codigos-de-barras": [
    {
      question: "¿Cuál es la diferencia entre un lector 1D y uno 2D (imager)?",
      answer:
        "Un lector 1D solo puede leer códigos de barras lineales (como Code 128 o EAN-13). Un lector 2D o imager puede leer tanto códigos lineales como bidimensionales (QR, Data Matrix, PDF417), y además suele poder leer códigos desde una pantalla de celular, algo que un lector 1D no puede hacer.",
    },
    {
      question: "¿Qué es el \"rango de lectura\" de un escáner?",
      answer:
        "Es la distancia mínima y máxima a la que el lector puede decodificar un código de barras de forma confiable, y varía según el tamaño del código y su resolución (mil). Los escáneres de rango estándar leen bien entre unos pocos centímetros y 30-40 cm; los de largo alcance pueden leer códigos a varios metros, útiles para racks altos en depósitos.",
    },
  ],
  rfid: [
    {
      question: "¿Qué diferencia a RFID UHF de RFID HF?",
      answer:
        "RFID UHF (banda de 860-960 MHz) permite lecturas a mayor distancia (varios metros) y es la tecnología estándar para trazabilidad de pallets, cajas y activos en logística. RFID HF (13,56 MHz) tiene menor alcance (centímetros) pero mayor precisión en entornos con metal o líquidos cercanos, y se usa en control de acceso e identificación de ítems individuales.",
    },
    {
      question: "¿Qué es el protocolo EPC Gen2?",
      answer:
        "Es el estándar internacional (ISO 18000-63) que define cómo los lectores UHF se comunican con los tags RFID pasivos. Es el protocolo que usa la gran mayoría del hardware RFID comercial actual, lo que garantiza compatibilidad entre lectores y tags de distintos fabricantes que cumplen el estándar.",
    },
  ],
};
