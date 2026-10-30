# Guía técnica, pruebas y despliegue

## Ambientes

| Ambiente | URL | Puerto VM | Directorio VM | Datos |
|---|---|---:|---|---|
| Pruebas | `https://test-joyeria.dev-fmv.duckdns.org/` | `3004` | `/home/fmv/apps/Joyeria-test` | Volumen independiente `joyeria-test_joyeria_data` |
| Producción | `https://joyeria.dev-fmv.duckdns.org/` | `3003` | `/home/fmv/apps/Joyeria` | Volumen independiente `joyeria_joyeria_data` |

Caddy termina TLS y dirige cada subdominio a su puerto. Pruebas agrega `X-Robots-Tag: noindex, nofollow, noarchive`. La aplicación añade una franja identificadora sólo cuando el hostname comienza por `test-`.

## Flujo obligatorio

1. Crear o continuar una rama con prefijo `codex/`.
2. Implementar el cambio sin fusionar a la rama principal.
3. Ejecutar la suite completa.
4. Confirmar que el árbol de trabajo sólo contiene los cambios esperados.
5. Crear el commit y subir la rama a GitHub.
6. Desplegar ese commit únicamente en pruebas.
7. Repetir la suite en la VM y revisar escritorio y móvil.
8. Entregar la URL de pruebas al propietario.
9. Esperar autorización explícita.
10. Sólo después de la aprobación, fusionar o promover exactamente el commit validado y desplegar producción.

Nunca use los datos de pruebas como respaldo de producción ni copie volúmenes entre ambientes. Las credenciales deben permanecer en `.env` fuera de Git.

## Pruebas

La suite actual cubre:

- modos de importación masiva y límite de 500 filas;
- autenticación administrativa y rechazo de credenciales inválidas;
- validación de imágenes y retiro lógico;
- 24 secciones y prefijos únicos;
- entidades, catálogo, solicitudes y persistencia JSON;
- rutas en dominio raíz, favicon y aviso exclusivo de pruebas;
- recursos visuales y el personalizador 3D conservado.

Ejecución reproducible:

```bash
docker compose build web
docker compose run --rm web node --test
git diff --check
```

Después del despliegue valide como mínimo:

```bash
curl -fsS https://test-joyeria.dev-fmv.duckdns.org/api/health
curl -fsSI https://test-joyeria.dev-fmv.duckdns.org/
```

También debe comprobar visualmente la tienda, `login.html` y `admin.html`, incluido el aviso de pruebas.

## Despliegue en pruebas

Desde la VM Ubuntu, usando la rama aprobada para revisión:

```bash
cd /home/fmv/apps/Joyeria-test
git pull --ff-only origin codex/catalog-import-modes
docker compose up -d --build
docker compose run --rm web node --test
```

Antes de informar el resultado, compruebe el commit activo y que producción no cambió:

```bash
git -C /home/fmv/apps/Joyeria-test rev-parse --short HEAD
git -C /home/fmv/apps/Joyeria rev-parse --short HEAD
```

La rama concreta puede cambiar en el futuro; use siempre la rama que contenga el cambio que el propietario debe revisar.

## Despliegue en producción

Este procedimiento requiere autorización explícita del propietario y debe usar el commit ya validado en pruebas:

```bash
cd /home/fmv/apps/Joyeria
git pull --ff-only origin <rama-autorizada>
docker compose up -d --build
docker compose run --rm web node --test
curl -fsS https://joyeria.dev-fmv.duckdns.org/api/health
```

Después se revisan la tienda, el acceso y el panel, y se confirma que la franja de entorno de pruebas no aparece en producción.

## Configuración

| Variable | Descripción | Ejemplo local |
|---|---|---|
| `APP_PORT` | Puerto publicado sólo en `127.0.0.1`. | `3003` |
| `WHATSAPP_NUMBER` | Número internacional sin `+` ni espacios. | `573175697698` |
| `ADMIN_PASSWORD` | Clave de acceso al panel. Debe reemplazarse. | No documentar la real |
| `BASE_PATH` | Ruta base interna; en los subdominios actuales es vacía. | `""` |

El contenedor usa sistema de archivos de solo lectura, `no-new-privileges`, `/tmp` temporal y un volumen persistente para `storage`.

## Datos y respaldos

El repositorio JSON inicial está en `data/products.json`. En ejecución, el contenedor mantiene el catálogo, las solicitudes y las fotografías cargadas bajo `/app/storage`, respaldado por el volumen Docker del ambiente.

Antes de una migración o cambio de almacenamiento, respalde el volumen correspondiente. No publique archivos del volumen, imágenes privadas, `.env` ni credenciales en GitHub.

## API

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/health` | Estado del servicio. |
| `GET` | `/api/products` | Catálogo público; admite filtro `category`. |
| `POST` | `/api/inquiries` | Solicitud comercial y enlace de WhatsApp. |
| `POST` | `/api/admin/login` | Obtiene token administrativo temporal. |
| `PUT` | `/api/admin/products/:id` | Actualiza datos o fotografía; requiere token. |
| `PUT` | `/api/admin/products/bulk` | Importa productos con modo `upsert`, `create` o `update`; requiere token. |

## Seguridad incorporada

- Token administrativo aleatorio en memoria y comparación segura de la clave.
- Límite del cuerpo HTTP y de 4 MB por fotografía.
- Sólo se aceptan imágenes PNG, JPEG y WebP.
- CSP, `X-Content-Type-Options`, `X-Frame-Options`, HSTS y políticas restrictivas en el proxy/aplicación.
- Validación de rutas para impedir recorridos de directorio.
- Productos retirados se desactivan; no se borran físicamente.

## Trabajo pendiente conocido

- Implementar cuentas reales de clientes, seguimiento de pedidos e historial de compras.
- Retomar, validar con usuarios y volver a mostrar el personalizador 3D de manillas y anillos.
- Evaluar una base de datos transaccional y respaldos automatizados cuando aumenten catálogo, pedidos o concurrencia.
