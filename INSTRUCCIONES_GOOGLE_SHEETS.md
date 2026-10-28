# Conectar el formulario con Google Sheets

Con esta conexión, cada opinión del formulario se agrega como una fila nueva en una hoja de cálculo.

## 1. Crear la hoja y el receptor

1. Crea una hoja de cálculo nueva en Google Sheets.
2. Copia el ID de la hoja: es el texto entre `/d/` y `/edit` en la dirección. Por ejemplo, en `https://docs.google.com/spreadsheets/d/ABC123/edit`, el ID es `ABC123`.
3. En esa hoja, abre **Extensiones → Apps Script**.
4. Borra el ejemplo que aparece y pega el contenido de `Code.gs`.
5. En la primera línea de `doPost`, reemplaza `PEGA_AQUI_EL_ID_DE_TU_HOJA` por el ID que copiaste. Conserva las comillas.
6. Pulsa **Guardar** y asigna un nombre al proyecto.
7. Pulsa **Implementar → Nueva implementación**.
8. Selecciona el tipo **Aplicación web**.
9. Configura **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona** (si la cuenta permite esa opción).
10. Pulsa **Implementar** y completa la autorización de Google.
11. Copia la **URL de la aplicación web** que termina en `/exec`.

La opción “Cualquier persona” es necesaria para que el sitio pueda enviar el formulario sin pedir a cada visitante que inicie sesión. Esa URL permite agregar filas a la hoja, así que compártela solo con quienes mantienen el sitio.

## 2. Activar el envío desde la página

1. Abre `script.js`.
2. Busca `const GOOGLE_SHEETS_WEB_APP_URL = '';`.
3. Pega entre las comillas la URL `/exec` que copiaste, por ejemplo:

   ```js
   const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/TU_ID/exec';
   ```

4. Guarda `script.js` y vuelve a cargar `index.html`.
5. Envía una respuesta de prueba y confirma que apareció una fila nueva en la hoja.

El formulario conserva también una copia local de las respuestas en el navegador y permite descargarla como CSV. La descarga local no reemplaza la comprobación de la fila en Google Sheets.

## Nota para publicar

La URL del receptor queda visible en el código del navegador. Por eso este método sirve para un MVP de clase, no para guardar información sensible. No pidas nombres, correos ni datos privados en este formulario.
