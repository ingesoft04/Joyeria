# BEZALEEL KR — Joyería y accesorios

Aplicación web full stack, responsive y organizada con principios SOLID para presentar el catálogo de BEZALEEL, recibir solicitudes por WhatsApp y permitir que una persona sin conocimientos técnicos administre productos, precios, estados y fotografías.

## Enlaces

- Pruebas: <https://test-joyeria.dev-fmv.duckdns.org/>
- Producción: <https://joyeria.dev-fmv.duckdns.org/>
- Instagram: <https://www.instagram.com/bezaleeljoyeriayaccesorios>
- WhatsApp: `+57 317 569 7698`

El entorno de pruebas muestra arriba el aviso **“Entorno de prueba · Los cambios aquí aún no están en producción”**. Los dos ambientes tienen contenedores, puertos y volúmenes independientes, por lo que editar el catálogo de pruebas no altera producción.

## Funcionalidades implementadas

- Tienda responsive con catálogo, filtros, imágenes de referencia y estados de inventario.
- Información de métodos de pago y enlaces oficiales de contacto.
- Inicio de sesión administrativo; las cuentas, pedidos e historial de clientes quedan señalados como una etapa futura.
- Panel de catálogo dividido entre cambios individuales y carga por plantilla.
- Creación de productos con código automático por sección.
- Edición de nombre, precio, material, descripción, estado y fotografía.
- Retiro lógico: un producto retirado deja de mostrarse, pero permanece guardado y puede reactivarse.
- Carga CSV compatible con Excel para hasta 500 filas, con validación previa y confirmación.
- Tres modalidades de importación: actualizar y crear, sólo crear o sólo actualizar.
- Carga simultánea de fotografías por el ID del producto.
- Favicon y recursos visuales de BEZALEEL en tienda, acceso y administración.
- Personalizador de manillas y anillos con tejidos, balines, dijes, tallas y vista 3D sobre mano femenina o masculina. Actualmente está conservado en el código pero oculto hasta retomar su desarrollo.
- Pruebas automatizadas de dominio, catálogo, importaciones, seguridad administrativa, persistencia y recursos visuales.

## Documentación

- [Guía para administrar el catálogo](docs/ADMINISTRACION-CATALOGO.md)
- [Guía técnica, pruebas y despliegue](docs/GUIA-TECNICA.md)
- [Estándar de carga masiva de imágenes](public/ESTANDAR-IMAGENES.txt)
- [Plantilla de catálogo](public/plantilla-catalogo.csv)

## Arquitectura

El backend usa Node.js sin dependencias externas de ejecución y separa responsabilidades así:

- `domain`: entidades y reglas esenciales.
- `application`: casos de uso de catálogo, administración y solicitudes.
- `infrastructure`: repositorios JSON intercambiables.
- `interfaces`: controlador HTTP.
- `public`: tienda y panel administrativo responsive.

Las dependencias se inyectan desde `src/server.js`; los casos de uso dependen de contratos de repositorio y no de detalles de almacenamiento.

## Ejecución local

Requisitos: Docker y Docker Compose.

```bash
cp .env.example .env
docker compose up -d --build
curl http://127.0.0.1:3003/api/health
docker compose run --rm web node --test
```

Configure una clave segura en `ADMIN_PASSWORD`. No guarde el archivo `.env` ni credenciales reales en Git.

## Regla de publicación

Todo cambio se desarrolla en una rama, se prueba y se publica primero en pruebas. Sólo se fusiona o despliega en producción después de la autorización explícita del propietario. Consulte el procedimiento completo en [docs/GUIA-TECNICA.md](docs/GUIA-TECNICA.md).
