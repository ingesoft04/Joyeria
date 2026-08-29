# Bezalel KR — Joyería y accesorios

Sitio full stack responsive para catálogo y solicitudes comerciales. Producción: `https://dev-fmv.duckdns.org/joyeria/`.

Administración visual: `https://dev-fmv.duckdns.org/joyeria/admin` (clave en `ADMIN_PASSWORD`). Permite editar precios, textos, disponibilidad y fotografías sin tocar código.

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
