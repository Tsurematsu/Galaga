import { crearJuego } from './juego.js';
import { cargarImagenSinFondo, cargarSpritesheet } from './recursos.js';

const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('canvas#planoDibujo'));

/**
 * Sincroniza las dimensiones lógicas del canvas con su tamaño visual CSS.
 * Devuelve true si hubo cambio.
 * @param {HTMLCanvasElement} canvas
 * @returns {boolean}
 */
function sincronizarTamano(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ancho = Math.round(rect.width);
  const alto  = Math.round(rect.height);

  if (canvas.width === ancho && canvas.height === alto) return false;

  canvas.width  = ancho;
  canvas.height = alto;
  return true;
}

async function main() {
  // Ajustar ANTES de crear el juego para que las entidades nazcan con las coordenadas correctas
  sincronizarTamano(canvas);

  const [imgJugador, imgEnemigo, framesMuerte] = await Promise.all([
    cargarImagenSinFondo('./imagenes/jugador.jpeg'),
    cargarImagenSinFondo('./imagenes/enemigo.jpeg'),
    cargarSpritesheet('./imagenes/enemigoMuerto.jpeg', 3),
  ]);

  const juego = crearJuego(canvas, {
    jugador: imgJugador,
    enemigo: imgEnemigo,
    framesMuerte,
  });

  // Re-inicializar si el canvas cambia de tamaño (responsive / orientación móvil)
  const observador = new ResizeObserver(() => {
    const cambio = sincronizarTamano(canvas);
    if (cambio) juego.redimensionar();
  });
  observador.observe(canvas);

  juego.iniciar();
}

main();