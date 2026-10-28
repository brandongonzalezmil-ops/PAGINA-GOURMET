// JavaScript: abre el menú en pantallas pequeñas y da una respuesta al formulario.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  menuButton.textContent = isOpen ? '×' : '☰';
});

// Al elegir un enlace, cerramos el menú para que no tape el contenido en móvil.
navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    menuButton.textContent = '☰';
  });
});

// El navegador guarda estas respuestas en localStorage para que sigan disponibles
// cuando se cierre y se vuelva a abrir esta página en el mismo dispositivo.
const feedbackForm = document.querySelector('#feedback-form');
const formMessage = document.querySelector('#form-message');
const responseCount = document.querySelector('#response-count');
const exportButton = document.querySelector('#export-responses');
const storageKey = 'vitalGourmetResponses';
// Pega aquí la URL de implementación de tu aplicación web de Google Apps Script.
const GOOGLE_SHEETS_WEB_APP_URL = '';

function getResponses() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

function updateResponseCount() {
  const count = getResponses().length;
  responseCount.textContent = count === 0
    ? 'Todavía no hay respuestas guardadas en este navegador.'
    : `${count} respuesta${count === 1 ? '' : 's'} guardada${count === 1 ? '' : 's'} en este navegador.`;
}

updateResponseCount();

feedbackForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(feedbackForm);
  const response = {
    fecha: new Date().toLocaleString('es-CO'),
    interes: formData.get('interest'),
    comentario: formData.get('thoughts').trim(),
  };
  const responses = getResponses();
  responses.push(response);
  localStorage.setItem(storageKey, JSON.stringify(responses));

  if (!GOOGLE_SHEETS_WEB_APP_URL) {
    formMessage.textContent = 'Opinión guardada en este navegador. Configura la URL de Google Sheets para recibir respuestas en línea.';
    feedbackForm.reset();
    updateResponseCount();
    return;
  }

  const submitButton = feedbackForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formMessage.textContent = 'Enviando tu opinión…';
  try {
    // URLSearchParams evita la solicitud CORS de comprobación previa.
    await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams(response),
    });
    formMessage.textContent = '¡Gracias! Se envió tu opinión. Revisa la hoja para confirmar que quedó registrada.';
    feedbackForm.reset();
  } catch {
    formMessage.textContent = 'No se pudo confirmar el envío. La opinión quedó guardada en este navegador; intenta de nuevo más tarde.';
  } finally {
    submitButton.disabled = false;
    updateResponseCount();
  }
});

// Crea un archivo CSV que se puede abrir con Excel o importar a Google Sheets.
exportButton.addEventListener('click', () => {
  const responses = getResponses();
  if (responses.length === 0) {
    formMessage.textContent = 'Aún no hay respuestas para descargar.';
    return;
  }

  const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [
    ['Fecha', 'Interés', 'Comentario'],
    ...responses.map(({ fecha, interes, comentario }) => [fecha, interes, comentario]),
  ];
  const csv = '\uFEFF' + rows.map((row) => row.map(escapeCsv).join(';')).join('\r\n');
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = 'respuestas-vital-gourmet.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});
