/**
 * @typedef {Object} Disparo
 * @property {number} x
 * @property {number} y
 * @property {number} ancho
 * @property {number} alto
 * @property {number} velocidad
 * @property {boolean} activo
 */

/** @returns {Disparo[]} */
export function crearListaDisparos() {
  return [];
}

/**
 * Agrega un disparo del jugador.
 * @param {Disparo[]} disparos
 * @param {{ x: number, y: number, ancho: number }} jugador
 */
export function dispararJugador(disparos, jugador) {
  disparos.push({
    x: jugador.x + jugador.ancho / 2 - 3,
    y: jugador.y,
    ancho: 6,
    alto: 14,
    velocidad: -7,
    activo: true,
  });
}

/**
 * Mueve todos los disparos y desactiva los que salen del canvas.
 * @param {Disparo[]} disparos
 * @param {number} altoCanvas
 */
export function actualizarDisparos(disparos, altoCanvas) {
  for (const d of disparos) {
    if (!d.activo) continue;
    d.y += d.velocidad;
    if (d.y < 0 || d.y > altoCanvas) d.activo = false;
  }

  disparos.splice(0, disparos.length, ...disparos.filter(d => d.activo));
}

/**
 * Dibuja todos los disparos del jugador.
 * @param {Disparo[]} disparos
 * @param {CanvasRenderingContext2D} ctx
 */
export function dibujarDisparos(disparos, ctx) {
  ctx.fillStyle = '#44ff88';
  for (const d of disparos) {
    ctx.fillRect(d.x, d.y, d.ancho, d.alto);
  }
}

/**
 * Revisa colisiones entre disparos y una lista de objetivos rectangulares.
 * @param {Disparo[]} disparos
 * @param {{ x: number, y: number, ancho: number, alto: number, vivo?: boolean }[]} objetivos
 * @param {(objetivo: any) => void} alGolpear
 */
export function revisarColisiones(disparos, objetivos, alGolpear) {
  for (const d of disparos) {
    if (!d.activo) continue;
    for (const obj of objetivos) {
      if (obj.vivo === false) continue;
      if (
        d.x < obj.x + obj.ancho &&
        d.x + d.ancho > obj.x &&
        d.y < obj.y + obj.alto &&
        d.y + d.alto > obj.y
      ) {
        d.activo = false;
        alGolpear(obj);
      }
    }
  }
}