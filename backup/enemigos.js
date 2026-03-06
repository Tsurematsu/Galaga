/**
 * @typedef {Object} Enemigo
 * @property {number} x
 * @property {number} y
 * @property {number} ancho
 * @property {number} alto
 * @property {ImageBitmap} imagen
 * @property {boolean} vivo
 * @property {{ frames: ImageBitmap[], frameActual: number, temporizador: number, completa: boolean } | null} animMuerte
 */

/**
 * @typedef {Object} BloqueEnemigos
 * @property {Enemigo[][]} grilla
 * @property {number} velocidad
 * @property {number} direccion
 * @property {number} descenso
 */

/**
 * @param {Object} config
 * @param {number} config.filas
 * @param {number} config.columnas
 * @param {number} config.anchoEnemigo
 * @param {number} config.altoEnemigo
 * @param {number} config.espaciado
 * @param {ImageBitmap} config.imagen
 * @param {ImageBitmap[]} config.framesMuerte  - frames del spritesheet de muerte
 * @returns {BloqueEnemigos}
 */
export function crearBloqueEnemigos({ filas, columnas, anchoEnemigo, altoEnemigo, espaciado, imagen, framesMuerte }) {
  const grilla = [];

  for (let f = 0; f < filas; f++) {
    const fila = [];
    for (let c = 0; c < columnas; c++) {
      fila.push({
        x: c * (anchoEnemigo + espaciado) + 50,
        y: f * (altoEnemigo + espaciado) + 50,
        ancho: anchoEnemigo,
        alto: altoEnemigo,
        imagen,
        vivo: true,
        _framesMuerte: framesMuerte, // referencia compartida
        animMuerte: null,
      });
    }
    grilla.push(fila);
  }

  return { grilla, velocidad: 1.5, direccion: 1, descenso: 20 };
}

/**
 * Inicia la animación de muerte de un enemigo.
 * @param {Enemigo} enemigo
 */
export function iniciarMuerteEnemigo(enemigo) {
  enemigo.vivo = false;
  enemigo.animMuerte = {
    frames: enemigo._framesMuerte,
    frameActual: 0,
    temporizador: 0,
    completa: false,
  };
}

const VELOCIDAD_ANIM = 6; // frames de juego por frame de animación

/**
 * Actualiza posición del bloque y animaciones de muerte.
 * @param {BloqueEnemigos} bloque
 * @param {number} anchoCanvas
 */
export function actualizarEnemigos(bloque, anchoCanvas) {
  let rebotar = false;

  for (const fila of bloque.grilla) {
    for (const enemigo of fila) {
      // Actualizar animación de muerte aunque no esté vivo
      if (enemigo.animMuerte && !enemigo.animMuerte.completa) {
        enemigo.animMuerte.temporizador++;
        if (enemigo.animMuerte.temporizador >= VELOCIDAD_ANIM) {
          enemigo.animMuerte.temporizador = 0;
          enemigo.animMuerte.frameActual++;
          if (enemigo.animMuerte.frameActual >= enemigo.animMuerte.frames.length) {
            enemigo.animMuerte.completa = true;
          }
        }
      }

      if (!enemigo.vivo) continue;

      enemigo.x += bloque.velocidad * bloque.direccion;
      if (enemigo.x + enemigo.ancho >= anchoCanvas || enemigo.x <= 0) {
        rebotar = true;
      }
    }
  }

  if (rebotar) {
    bloque.direccion *= -1;
    for (const fila of bloque.grilla) {
      for (const enemigo of fila) {
        if (enemigo.vivo) enemigo.y += bloque.descenso;
      }
    }
  }
}

/**
 * Dibuja enemigos vivos y animaciones de muerte en curso.
 * @param {BloqueEnemigos} bloque
 * @param {CanvasRenderingContext2D} ctx
 */
export function dibujarEnemigos(bloque, ctx) {
  for (const fila of bloque.grilla) {
    for (const enemigo of fila) {
      if (enemigo.vivo) {
        ctx.drawImage(enemigo.imagen, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
      } else if (enemigo.animMuerte && !enemigo.animMuerte.completa) {
        const frame = enemigo.animMuerte.frames[enemigo.animMuerte.frameActual];
        ctx.drawImage(frame, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
      }
    }
  }
}

/**
 * Devuelve los enemigos vivos en lista plana.
 * @param {BloqueEnemigos} bloque
 * @returns {Enemigo[]}
 */
export function enemigosVivos(bloque) {
  return bloque.grilla.flat().filter(e => e.vivo);
}

/**
 * True si todos los enemigos murieron Y todas las animaciones terminaron.
 * @param {BloqueEnemigos} bloque
 */
export function bloqueTerminado(bloque) {
  return bloque.grilla.flat().every(e => !e.vivo && (!e.animMuerte || e.animMuerte.completa));
}