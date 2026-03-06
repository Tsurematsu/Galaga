/**
 * @typedef {Object} Jugador
 * @property {number} x
 * @property {number} y
 * @property {number} ancho
 * @property {number} alto
 * @property {number} velocidad
 * @property {HTMLImageElement} imagen
 * @property {Object} teclas - estado de teclas presionadas
 */

/**
 * Crea al jugador.
 * @param {Object} config
 * @param {number} config.anchoCanvas
 * @param {number} config.altoCanvas
 * @param {number} config.ancho
 * @param {number} config.alto
 * @param {HTMLImageElement} config.imagen
 * @returns {Jugador}
 */
export function crearJugador({ anchoCanvas, altoCanvas, ancho, alto, imagen }) {
  return {
    x: anchoCanvas / 2 - ancho / 2,
    y: altoCanvas - alto - 10,
    ancho,
    alto,
    velocidad: 4,
    imagen,
    teclas: { izquierda: false, derecha: false },
  };
}

/**
 * Registra los listeners de teclado para mover al jugador.
 * @param {Jugador} jugador
 */
export function registrarControles(jugador) {
  const mapa = {
    ArrowLeft: 'izquierda', a: 'izquierda',
    ArrowRight: 'derecha',  d: 'derecha',
  };

  window.addEventListener('keydown', e => {
    if (mapa[e.key]) jugador.teclas[mapa[e.key]] = true;
  });

  window.addEventListener('keyup', e => {
    if (mapa[e.key]) jugador.teclas[mapa[e.key]] = false;
  });
}

/**
 * Actualiza la posición del jugador según las teclas presionadas.
 * @param {Jugador} jugador
 * @param {number} anchoCanvas
 */
export function actualizarJugador(jugador, anchoCanvas) {
  if (jugador.teclas.izquierda) jugador.x -= jugador.velocidad;
  if (jugador.teclas.derecha)   jugador.x += jugador.velocidad;

  // Límites del canvas
  jugador.x = Math.max(0, Math.min(anchoCanvas - jugador.ancho, jugador.x));
}

/**
 * Dibuja al jugador en el canvas.
 * @param {Jugador} jugador
 * @param {CanvasRenderingContext2D} ctx
 */
export function dibujarJugador(jugador, ctx) {
  ctx.drawImage(jugador.imagen, jugador.x, jugador.y, jugador.ancho, jugador.alto);
}