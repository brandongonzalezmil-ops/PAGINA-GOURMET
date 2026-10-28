/**
 * Receptor sencillo para las opiniones del sitio VITAL GOURMET.
 * Crea una hoja con encabezados y agrega una fila por cada formulario enviado.
 */
function doPost(e) {
  const spreadsheet = SpreadsheetApp.openById('PEGA_AQUI_EL_ID_DE_TU_HOJA');
  const sheet = spreadsheet.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha de recepción', 'Interés', 'Comentario']);
    sheet.setFrozenRows(1);
  }

  const data = e.parameter || {};
  sheet.appendRow([
    new Date(),
    cleanCell(data.interes),
    cleanCell(data.comentario),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Evita que un comentario que empiece con =, +, - o @ se interprete como fórmula.
function cleanCell(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
