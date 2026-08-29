# Bezalel KR — Joyería y accesorios

Sitio full stack responsive para catálogo y solicitudes comerciales. Producción: `https://dev-fmv.duckdns.org/joyeria/`.

Canales oficiales: [Instagram](https://www.instagram.com/bezaleeljoyeriayaccesorios) y WhatsApp `+57 317 569 7698`.

Administración visual: `https://dev-fmv.duckdns.org/joyeria/admin` (clave en `ADMIN_PASSWORD`). Permite editar precios, textos, disponibilidad y fotografías sin tocar código.

La tienda enlaza a `login.html`, que por ahora autentica solamente al administrador. La interfaz documenta la futura zona de clientes para cuentas, seguimiento de pedidos e historial sin presentarla como una función ya disponible.

El panel agrupa los productos por categoría con prefijos `AR-`, `MA-`, `AN-` y `PE-`. La plantilla compatible con Excel utiliza tres columnas binarias (`disponible`, `agotado`, `retirado`): exactamente una debe llevar `1` y las otras `0`. Permite actualizar hasta 500 productos por carga.

Las fotografías también admiten carga masiva. El nombre del archivo debe ser el ID del producto (`AR-001.jpg`); el panel valida coincidencias y tamaño antes de publicar secuencialmente cada imagen.

## Arquitectura

- `domain`: entidades y reglas esenciales.
- `application`: casos de uso del catálogo y solicitudes.
- `infrastructure`: repositorios JSON intercambiables.
- `interfaces`: controlador HTTP.
- `public`: interfaz responsive accesible.

Las dependencias se inyectan en `server.js`; los casos de uso dependen de contratos implícitos y no del almacenamiento (DIP/SOLID).

## Ejecutar

```bash
cp .env.example .env
docker compose up -d --build
curl http://127.0.0.1:3003/joyeria/api/health
npm test
```

Antes de publicar, configure en `.env` el número de WhatsApp internacional sin `+`.
