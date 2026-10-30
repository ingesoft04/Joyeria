# Guía para administrar el catálogo

Esta guía está pensada para la persona encargada de actualizar la tienda sin modificar código.

## Ingreso

1. Abra el entorno que corresponda y pulse **Iniciar sesión**.
2. Escriba la clave administrativa.
3. Elija **Cambiar uno por uno** o **Cargar por plantilla**.

Primero realice y revise los cambios en <https://test-joyeria.dev-fmv.duckdns.org/>. El aviso dorado de la parte superior confirma que está en pruebas. Los cambios de pruebas no pasan automáticamente a producción.

## Cambiar un producto

1. Seleccione **Cambiar uno por uno**.
2. Elija la sección del producto.
3. Abra el producto y cambie sólo los campos necesarios.
4. Pulse **Guardar este producto** y espere el mensaje de confirmación.

Estados disponibles:

- **Disponible:** aparece normalmente y se puede consultar.
- **Agotado:** sigue visible con indicación de agotado.
- **Retirado:** desaparece de la tienda, pero no se borra de la base de datos.

Para devolver un producto retirado a la tienda, cambie su estado a **Disponible** o **Agotado** y guarde.

## Crear un producto

1. Entre a **Cambiar uno por uno**.
2. Abra la sección correcta.
3. Pulse **Crear producto**.
4. Complete nombre, precio, estado, material, descripción y, si desea, la fotografía.

El sistema asigna automáticamente el siguiente código disponible con el prefijo de la sección. No reutilice códigos de otros productos.

## Cambiar muchos productos con Excel

1. Seleccione **Cargar por plantilla**.
2. Descargue `plantilla-catalogo.csv` desde el panel.
3. Ábrala con Excel o LibreOffice sin cambiar los títulos de las columnas.
4. Edite las filas necesarias y guarde como **CSV UTF-8**.
5. Seleccione el archivo en el panel y pulse **Validar y continuar**.
6. Revise el número de filas validadas.
7. Elija una modalidad:
   - **Actualizar y crear:** modifica códigos existentes y crea códigos nuevos.
   - **Sólo crear nuevos:** omite cualquier código que ya exista.
   - **Sólo actualizar existentes:** omite códigos que todavía no existan.
8. Confirme la operación. Antes de esa confirmación no se modifica el catálogo.

La plantilla acepta entre 1 y 500 productos. Sus columnas son:

| Columna | Uso |
|---|---|
| `seccion` | Nombre técnico de la sección; debe conservarse exactamente. |
| `prefijo` | Prefijo asignado a esa sección. |
| `numero` | Número del producto; `1` se convierte en `001`. |
| `nombre` | Nombre que verá el cliente. |
| `precio` | Valor numérico en pesos, sin símbolos. |
| `material` | Material o detalle corto. |
| `descripcion` | Descripción comercial. |
| `disponible` | Escriba `1` si está disponible; de lo contrario `0`. |
| `agotado` | Escriba `1` si está agotado; de lo contrario `0`. |
| `retirado` | Escriba `1` si debe ocultarse; de lo contrario `0`. |

En cada fila debe existir exactamente un `1` entre `disponible`, `agotado` y `retirado`. Las otras dos columnas deben llevar `0`.

## Secciones y prefijos

| Grupo | Sección | Valor de `seccion` | Prefijo |
|---|---|---|---|
| Oro | Balines lisos | `balines_lisos` | `BL` |
| Oro | Balines diamantados | `balines_diamantados` | `BD` |
| Oro | Barriles | `barriles` | `BA` |
| Oro | Roscas de seguridad | `roscas_seguridad` | `RS` |
| Oro | Candados ITL | `candados_itl` | `CI` |
| Oro | Riazas | `riazas` | `RI` |
| Oro | Candongas | `candongas` | `CA` |
| Oro | Topos variedad | `topos` | `TO` |
| Oro | Herrajes | `herrajes` | `HE` |
| Oro | Cadenas NCL | `cadenas_ncl` | `CN` |
| Oro | Cadenas ITL | `cadenas_itl` | `CT` |
| Oro | Dijes | `dijes` | `DI` |
| Oro | Pulseras NCL | `pulseras_ncl` | `PN` |
| Oro | Pulseras ITL | `pulseras_itl` | `PT` |
| Oro | Anillos | `anillos` | `AN` |
| Accesorios y regalos | Manillas personalizadas | `manillas_personalizadas` | `MP` |
| Accesorios y regalos | Accesorios | `accesorios` | `AC` |
| Accesorios y regalos | Accesorios para el cabello | `accesorios_cabello` | `CB` |
| Accesorios y regalos | Peluches | `peluches` | `PE` |
| Accesorios y regalos | Mugs | `mugs` | `MU` |
| Accesorios y regalos | Cepillos para el cabello | `cepillos_cabello` | `CP` |
| Accesorios y regalos | Maquillaje | `maquillaje` | `MQ` |
| Accesorios y regalos | Muñecas | `munecas` | `MN` |
| Accesorios y regalos | Llaveros | `llaveros` | `LL` |

## Carga masiva de fotografías

1. Consulte el ID exacto del producto, por ejemplo `AN-001`.
2. Renombre la fotografía con ese ID: `AN-001.jpg`, `AN-001.png` o `AN-001.webp`.
3. En **Cargar por plantilla**, abra **Cambiar muchas fotografías**.
4. Seleccione todas las imágenes necesarias.
5. Revise la lista de coincidencias antes de publicar.
6. Pulse **Publicar fotografías** y confirme.

Cada archivo puede pesar máximo 4 MB. Se recomienda una imagen cuadrada de al menos 1000 × 1000 píxeles, con el producto centrado, buena iluminación y fondo consistente. Los archivos sin producto coincidente se rechazan.

## Recomendaciones de seguridad

- No comparta la clave administrativa por mensajes públicos.
- Cierre la pestaña al terminar; la sesión se conserva sólo en esa pestaña del navegador.
- Pruebe primero cargas grandes en el entorno de pruebas.
- No edite prefijos ni encabezados de la plantilla.
