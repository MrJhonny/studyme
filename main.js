// Detección de idioma por URL o navegador
function getLang() {
  // 1. Por ruta tipo /en o /es
  const path = window.location.pathname;
  const match = path.match(/^\/(en|es|fr)(\/|$)/);
  if (match) return match[1];
  // 2. Por navegador
  const nav = navigator.language || navigator.userLanguage || 'es';
  if (nav.startsWith('en')) return 'en';
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('fr')) return 'fr';
  return 'es';
}
// Función para aplicar traducciones
function applyTranslations() {
  if (typeof translations === 'undefined') return;
  const lang = getLang();
  const t = translations[lang] || translations['es'];
  document.querySelector('label[for="file-input"]').textContent = t.fileLabel;
  document.querySelector('label[for="duration-input"]').textContent = t.durationLabel;
  document.querySelector('label[for="pass-input"]').textContent = t.passLabel;
  document.getElementById('start-btn').textContent = t.startBtn;
  // Botones quiz
  document.getElementById('prev-btn').textContent = t.prevBtn;
  document.getElementById('show-answer-btn').textContent = t.showAnswerBtn;
  document.getElementById('next-btn').textContent = t.nextBtn;
  // Progreso
  document.getElementById('progress-text').textContent = `${t.progress}: 0/0`;
  // Footer
  document.querySelector('footer').innerHTML = t.footer;
  // Modal
  const modalTitle = document.getElementById('timeoutModalLabel');
  if (modalTitle) modalTitle.textContent = t.timeoutTitle;
  const modalBody = document.querySelector('#timeoutModal .modal-body');
  if (modalBody) modalBody.innerHTML = t.timeoutBody;
  const modalBtn = document.querySelector('#timeoutModal .modal-footer button');
  if (modalBtn) modalBtn.textContent = t.timeoutAccept;
}
// --- Traducciones ---
// El objeto translations ahora se carga desde languages.js
// Asegúrate de incluir <script src="languages.js"></script> antes de main.js en tu index.html

document.addEventListener('DOMContentLoaded', applyTranslations);

// Lógica principal para Estudiame
let preguntas = [];
let indiceActual = 0;
let tiempoPorPregunta = 30; // segundos (ya no se usa como timer individual)
let timerInterval = null; // ya no se usa
let tiempoTotal = 30 * 60; // segundos
let tiempoTotalRestante = 0;
let timerTotalInterval = null;
let porcentajeAprobacion = 60;

const setupSection = document.getElementById('setup-section');
const setupForm = document.getElementById('setup-form');
const fileInput = document.getElementById('file-input');
const durationInput = document.getElementById('duration-input');
const passInput = document.getElementById('pass-input');
const startBtn = document.getElementById('start-btn');
const quizSection = document.getElementById('quiz-section');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const timeLeft = document.getElementById('time-left');
const questionDiv = document.getElementById('question');
const answerDiv = document.getElementById('answer');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');

setupForm.addEventListener('submit', handleSetupSubmit);
prevBtn.addEventListener('click', () => cambiarPregunta(-1));
nextBtn.addEventListener('click', () => cambiarPregunta(1));
showAnswerBtn.addEventListener('click', mostrarRespuesta);

// Eliminar import/export de parser.js, usar solo esta función

function handleSetupSubmit(e) {
  e.preventDefault();
  const lang = getLang();
  const t = translations[lang];
  const file = fileInput.files[0];
  if (!file) {
    alert(t.valFile);
    return;
  }
  const minutos = parseInt(durationInput.value, 10);
  if (isNaN(minutos) || minutos < 1) {
    alert(t.valDuration);
    return;
  }
  tiempoTotal = minutos * 60;
  tiempoTotalRestante = tiempoTotal;
  tiempoPorPregunta = Math.floor(tiempoTotal / 10); // Por defecto, pero se puede ajustar
  const porcentaje = parseInt(passInput.value, 10);
  if (isNaN(porcentaje) || porcentaje < 1 || porcentaje > 100) {
    alert(t.valPass);
    return;
  }
  porcentajeAprobacion = porcentaje;
  // Leer archivo y comenzar
  const reader = new FileReader();
  reader.onload = function(evt) {
    preguntas = parsePreguntas(evt.target.result);
    if (preguntas.length > 0) {
      indiceActual = 0;
      setupSection.style.display = 'none';
      quizSection.style.display = '';
      iniciarExamen();
    } else {
      alert(t.valNoQuestions);
    }
  };
  reader.readAsText(file);
}

function iniciarExamen() {
  // Ajustar tiempo por pregunta si se quiere proporcional
  tiempoPorPregunta = Math.floor(tiempoTotal / preguntas.length);
  mostrarPregunta();
  reiniciarTimerTotal();
}

function reiniciarTimerTotal() {
  clearInterval(timerTotalInterval);
  tiempoTotalRestante = tiempoTotal;
  actualizarTimerTotal();
  timerTotalInterval = setInterval(() => {
    tiempoTotalRestante--;
    actualizarTimerTotal();
    if (tiempoTotalRestante <= 0) {
      clearInterval(timerTotalInterval);
      mostrarTimeoutModal();
      mostrarResumen();
    }
  }, 1000);
}

function mostrarTimeoutModal() {
  const modalEl = document.getElementById('timeoutModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
  // Al cerrar el modal, quitar el foco del botón para evitar el warning de accesibilidad
  modalEl.addEventListener('hidden.bs.modal', () => {
    document.activeElement && document.activeElement.blur();
  }, { once: true });
}

function actualizarTimerTotal() {
  let t = tiempoTotalRestante;
  if (typeof t !== 'number' || t < 0) t = 0;
  const min = String(Math.floor(t / 60)).padStart(2, '0');
  const seg = String(t % 60).padStart(2, '0');
  timeLeft.textContent = `${min}:${seg}`;
}

// handleFile eliminado, ahora el archivo se lee al iniciar el examen

function parsePreguntas(texto) {
  // Formato: pregunta|a)|b)|c)|d)|respuesta_correcta (puede ser a,c)
  const lineas = texto.split(/\n+/).map(l => l.trim()).filter(Boolean);
  return lineas.map(linea => {
    const partes = linea.split('|');
    if (partes.length < 6) return null;
    const pregunta = partes[0];
    const opciones = partes.slice(1, 5);
    // Respuestas correctas: pueden ser "a", "b", "c", "d" o varias separadas por coma
    const correctasStr = partes[5].split(',').map(s => s.trim().toLowerCase());
    const letras = ['a', 'b', 'c', 'd'];
    const correctas = correctasStr.map(letra => letras.indexOf(letra)).filter(idx => idx >= 0);
    return {
      pregunta,
      opciones,
      correctas,
      seleccion: [],
      tiempoRestante: tiempoPorPregunta, // tiempo individual por pregunta
    };
  }).filter(Boolean);
}

function mostrarPregunta() {
  if (preguntas.length === 0) return;
  const actual = preguntas[indiceActual];
  // Limpiar contenedores
  questionDiv.innerHTML = '';
  answerDiv.style.display = 'none';
  answerDiv.innerHTML = '';

  // Pregunta (Bootstrap)
  const preguntaElem = document.createElement('div');
  preguntaElem.innerHTML = `<span class="fs-5 fw-bold text-dark">${actual.pregunta}</span>`;
  preguntaElem.className = 'mb-3';
  questionDiv.appendChild(preguntaElem);

  // Determinar si es múltiple
  const esMultiple = actual.correctas.length > 1;
  // Renderizar opciones con formato tipo examen
  const form = document.createElement('form');
  form.id = 'alternativas-form';
  form.className = 'mb-3';
  const letras = ['a', 'b', 'c', 'd'];
  actual.opciones.forEach((op, idx) => {
    const div = document.createElement('div');
    div.className = 'form-check mb-2';
    const input = document.createElement('input');
    input.type = esMultiple ? 'checkbox' : 'radio';
    input.className = 'form-check-input';
    input.name = esMultiple ? 'alternativa_' + indiceActual : 'alternativa';
    input.value = idx;
    input.id = `op${indiceActual}_${idx}`;
    if (actual.seleccion.includes(idx)) input.checked = true;
    input.addEventListener('change', () => {
      if (esMultiple) {
        if (input.checked) {
          if (!actual.seleccion.includes(idx)) actual.seleccion.push(idx);
        } else {
          actual.seleccion = actual.seleccion.filter(i => i !== idx);
        }
      } else {
        actual.seleccion = [idx];
        // Desmarcar otros radios
        Array.from(form.elements).forEach(el => {
          if (el !== input) el.checked = false;
        });
      }
    });
    const label = document.createElement('label');
    label.className = 'form-check-label fw-semibold';
    label.setAttribute('for', input.id);
    label.innerHTML = `<span class='badge bg-primary me-2'>${letras[idx]})</span> <span>${op}</span>`;
    div.appendChild(input);
    div.appendChild(label);
    form.appendChild(div);
  });
  questionDiv.appendChild(form);
  // Deshabilitar botones según posición
  prevBtn.disabled = indiceActual === 0;
  if (indiceActual === preguntas.length - 1) {
    nextBtn.textContent = 'Finalizar';
  } else {
    nextBtn.textContent = 'Siguiente';
  }
  nextBtn.disabled = false;
  actualizarProgreso();
}


function mostrarRespuesta() {
  answerDiv.style.display = '';
  const actual = preguntas[indiceActual];
  const form = document.getElementById('alternativas-form');
  if (!form) return;
  // Resaltar correctas y seleccionadas
  Array.from(form.elements).forEach((input, idx) => {
    const label = input.parentElement;
    label.style.fontWeight = '';
    label.style.color = '';
    if (actual.correctas.includes(idx) && actual.seleccion.includes(idx)) {
      label.style.color = '#16a34a';
      label.style.fontWeight = 'bold';
    } else if (actual.correctas.includes(idx)) {
      label.style.color = '#2563eb';
    } else if (actual.seleccion.includes(idx)) {
      label.style.color = '#dc2626';
    }
  });
}

function cambiarPregunta(delta) {
  if (indiceActual === preguntas.length - 1 && delta > 0) {
    mostrarResumen();
    return;
  }
  indiceActual += delta;
  if (indiceActual < 0) indiceActual = 0;
  if (indiceActual >= preguntas.length) indiceActual = preguntas.length - 1;
  mostrarPregunta();
}

function mostrarResumen() {
  clearInterval(timerInterval); // Detener el tiempo global
  clearInterval(timerTotalInterval); // Detener el tiempo total
  const lang = getLang();
  const t = translations[lang];
  questionDiv.innerHTML = `<h2>${t.summaryTitle}</h2>`;
  answerDiv.style.display = '';
  answerDiv.innerHTML = '';
  let correctasTotales = 0;
  preguntas.forEach((preg, idx) => {
    const div = document.createElement('div');
    div.style.marginBottom = '1.2em';
    const num = document.createElement('strong');
    num.textContent = `${t.qLabel} ${idx + 1}: `;
    num.style.color = '#000';
    div.appendChild(num);
    const preguntaSpan = document.createElement('span');
    preguntaSpan.textContent = preg.pregunta;
    preguntaSpan.style.color = '#000';
    div.appendChild(preguntaSpan);
    const ul = document.createElement('ul');
    preg.opciones.forEach((op, i) => {
      const li = document.createElement('li');
      let texto = op;
      // Verde: correcta y seleccionada
      if (preg.correctas.includes(i) && preg.seleccion.includes(i)) {
        texto += ' ✔️';
        li.style.color = '#16a34a';
        correctasTotales++;
      // Rojo: seleccionada pero incorrecta
      } else if (!preg.correctas.includes(i) && preg.seleccion.includes(i)) {
        texto += ` ${t.yourPick}`;
        li.style.color = '#dc2626';
      // Azul: correcta pero no seleccionada
      } else if (preg.correctas.includes(i)) {
        texto += ` ${t.correct}`;
        li.style.color = '#2563eb';
      } else {
        li.style.color = '#000';
      }
      li.textContent = texto;
      ul.appendChild(li);
    });
    // Mostrar tiempo usado en la pregunta
    const tiempoUsado = tiempoPorPregunta - (preg.tiempoRestante ?? 0);
    const tiempoDiv = document.createElement('div');
    tiempoDiv.style.fontSize = '0.95em';
    tiempoDiv.style.color = '#555';
    tiempoDiv.textContent = `${t.timeUsed}: ${tiempoUsado >= 0 ? tiempoUsado : 0} ${t.seconds}`;
    div.appendChild(ul);
    div.appendChild(tiempoDiv);
    answerDiv.appendChild(div);
  });
  // Mostrar puntaje y aprobación
  const totalPreguntas = preguntas.length;
  const totalCorrectas = preguntas.filter(p => {
    if (p.correctas.length !== p.seleccion.length) return false;
    return p.correctas.every(idx => p.seleccion.includes(idx));
  }).length;
  const porcentaje = totalPreguntas > 0 ? Math.round((totalCorrectas / totalPreguntas) * 100) : 0;
  const aprobado = porcentaje >= porcentajeAprobacion;
  const score = document.createElement('div');
  score.innerHTML = `<strong>${t.finalScore}: ${totalCorrectas} / ${totalPreguntas} (${porcentaje}%)<br>${aprobado ? t.approved : t.notApproved}</strong>`;
  score.style.fontSize = '1.2em';
  score.style.marginTop = '1.5em';
  score.style.color = aprobado ? '#16a34a' : '#dc2626';
  answerDiv.appendChild(score);
  // Deshabilitar botones
  prevBtn.disabled = true;
  showAnswerBtn.disabled = true;
  timeLeft.textContent = '--:--';
  // Cambiar el botón siguiente/finalizar a Reiniciar
  nextBtn.disabled = false;
  nextBtn.textContent = 'Reiniciar';
  nextBtn.classList.remove('btn-primary');
  nextBtn.classList.add('btn-danger');
  nextBtn.onclick = () => { window.location.reload(); };
}

function actualizarProgreso() {
  progressText.textContent = `Progreso: ${indiceActual + 1}/${preguntas.length}`;
  const porcentaje = ((indiceActual + 1) / preguntas.length) * 100;
  progressFill.style.width = porcentaje + '%';
}

// El timer por pregunta ha sido eliminado. Solo se usa el global.

function actualizarTimer() {
  let t = tiempoRestante;
  if (typeof t !== 'number' || t < 0) t = 0;
  const min = String(Math.floor(t / 60)).padStart(2, '0');
  const seg = String(t % 60).padStart(2, '0');
  timeLeft.textContent = `${min}:${seg}`;
}
