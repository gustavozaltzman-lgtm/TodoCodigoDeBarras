# Plan e-commerce (Fase 2) — diseño, sin implementar

> Estado: **solo diseño, nada construido** (nov. 2026). La Fase 2 requiere
> aprobación explícita (ver [ROADMAP.md](ROADMAP.md)). Este documento guarda el
> diagnóstico y la propuesta para retomarlos sin repetir el análisis.

## 1. Diagnóstico: qué hay y qué falta

| Pieza | Estado hoy | Para vender online |
|---|---|---|
| Stack | Next.js 16 con Server Actions y Route Handlers, Neon, Drizzle, Vercel, Resend | Alcanza, sin infraestructura nueva |
| Precio | `price` y `cost_price` en `numeric(12,2)`, `currency` por defecto USD. 55 de 63 publicados tienen precio, internos y sin mostrar | Hay que decidir la política de precios |
| SKU | `sku` único | Listo |
| Stock | Solo el enum `availability`, sin cantidad (decisión vigente: dejarlo así) | **Bloqueante**: cantidad o regla "disponible = vendible" |
| Peso y dimensiones | No existen | Necesarios para envíos |
| Tipo de venta | No existe (`online` vs `quote`) | Campo nuevo |
| IVA | No existe (10,5 % o 21 %) | Campo nuevo por producto o categoría |
| Carrito | Existe la lista de cotización (localStorage, `useSyncExternalStore`, panel lateral en 2 pasos) | Reutilizable casi entera |
| Órdenes y pagos | No existen | Tablas nuevas |
| Facturación A/B | No existe | Datos fiscales en la orden |
| Email | Resend en sandbox (`onboarding@resend.dev`) | Verificar dominio para mails a clientes |
| Auth de clientes | Solo admin | No hace falta: checkout como invitado |
| Admin | Productos, marcas, categorías, consultas | Falta pantalla de pedidos |

Datos al 25/11/2026: 151 productos; 63 publicados (55 con precio), 88 en borrador (86 con precio).

## 2. Decisiones del negocio que desbloquean el resto

1. **Política de precios.** Propuesta mixta: `sale_mode` = `online` (precio visible y botón Comprar) o `quote` (cotización actual). Empezar con insumos y equipos de escritorio en `online`, el resto en `quote`.
2. **Moneda.** Precios en USD. Recomendado: cotización manual cargada en el admin, con fecha visible, congelada en la orden al crearla. Alternativa: API de dólar oficial (depende de un tercero y de elegir oficial/blue/MEP).
3. **IVA.** Confirmar con el contador si los precios cargados incluyen IVA. Validar también la alícuota: el 10,5 % aplica a ciertos bienes de capital, no a todo el hardware.
4. **Stock.** A: agregar `stock_qty` y descontar al aprobarse el pago. B: mantener el enum y confirmar disponibilidad a mano (más rápido, riesgo de vender lo que no hay).
5. **Envíos.** Retiro gratis en Pizarro 5201 y tarifa plana por zona (CABA, GBA, interior). Cálculo por código postal (Andreani, Correo Argentino) como mejora posterior.
6. **Facturación.** Mercado Pago no factura. Definir si se factura a mano, con el sistema actual o con ARCA vía un servicio de terceros.
7. **Cuenta de Mercado Pago** con credenciales de prueba y producción.

## 3. Modelo de datos propuesto

- **`products`** (campos nuevos): `sale_mode`, `vat_rate`, `weight_g`, `length_mm`, `width_mm`, `height_mm`, `min_qty`, `pack_size` y, según la decisión 4, `stock_qty`.
- **`orders`**: `id`, `number` (legible), `status`; cliente (email, teléfono, `billing_type` B/A, CUIT, razón social, domicilio fiscal); entrega (`delivery_method`, dirección, costo de envío); totales (subtotal, IVA, total); moneda (`currency`, `fx_rate`, `total_ars` congelados); Mercado Pago (`mp_preference_id`, `mp_payment_id`); `created_at`, `paid_at`.
- **`order_items`**: `product_id`, `sku` y `name` copiados, `unit_price`, `vat_rate`, `qty`.
- **`order_events`**: historial de estados y eventos de pago (auditoría y webhooks duplicados).
- **`shipping_zones`**: zona, tarifa, mínimo para envío gratis.
- **`fx_rates`** (opcional): cotización con fecha.

Estados: `pending_payment` → `paid` → `preparing` → `shipped` / `ready_for_pickup` → `delivered`; además `cancelled`, `payment_rejected`, `expired`.

## 4. Arquitectura de Mercado Pago

Checkout Pro (redirección, PCI delegado).

- **Crear checkout** (`POST /api/checkout` o Server Action): recibe solo slug y cantidad; precio, IVA y stock se leen de la base (como `submitQuoteAction`); crea la orden en `pending_payment` y la preferencia con `external_reference` = número de orden; devuelve la URL de pago. Reutiliza límite por IP y honeypot.
- **Webhook** (`POST /api/webhooks/mercadopago`): valida `x-signature`; consulta el pago a la API de MP sin confiar en el cuerpo; actualiza la orden de forma idempotente; descuenta stock si corresponde; dispara emails.
- **Retornos** `/checkout/success`, `/pending`, `/failure`: solo informan (número de orden, resumen, WhatsApp); el estado real lo marca el webhook.
- **Dependencia**: SDK `mercadopago` o `fetch` directo.
- **Env nuevas**: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `NEXT_PUBLIC_MP_PUBLIC_KEY`.
- **CSP**: permitir dominios de Mercado Pago en `next.config.ts`.

## 5. Plan por fases (cada una publicable sola)

1. **Datos y carrito**: migración de `products`, carga de pesos/IVA/modo de venta, carrito persistente (reusa el store de cotización), precios visibles solo en `online`, `Offer` en JSON-LD.
2. **Checkout**: datos del comprador con validación de CUIT, retiro o envío por zona, tablas de órdenes, revisión del pedido; todavía sin pago (orden pendiente + email).
3. **Mercado Pago**: preferencias, webhook, pantallas de retorno, pruebas en sandbox y luego producción.
4. **Operación**: pedidos en el admin, cambio de estado, emails transaccionales con dominio verificado en Resend, ajuste de legales (términos de venta, arrepentimiento, defensa del consumidor) revisado por un abogado.

## 6. Riesgos

- Vender cambia obligaciones legales (botón de arrepentimiento, garantías, facturación electrónica); no las resuelve el código.
- Mostrar precios con `Offer` en JSON-LD los hace visibles a Google y a la competencia.
- Productos sin precio (8 publicados y 2 en borrador) quedarían en `quote`.

## 7. Preguntas pendientes para arrancar

1. ¿Precios con o sin IVA?
2. ¿Cotización de dólar manual?
3. ¿Stock con cantidad real o solo disponible o no?
4. ¿Cómo se factura hoy?
5. ¿Qué categorías se venderían online en la primera etapa?
