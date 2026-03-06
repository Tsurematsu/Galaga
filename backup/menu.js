/**
 * @typedef {'inicio' | 'jugando' | 'gameOver'} EstadoMenu
 */

/**
 * Dibuja la pantalla según el estado actual del juego.
 * @param {CanvasRenderingContext2D} ctx
 * @param {EstadoMenu} estado
 * @param {number} puntuacion
 * @param {number} mejorPuntuacion
 */
export function dibujarMenu(ctx, estado, puntuacion, mejorPuntuacion) {
  const { width: w, height: h } = ctx.canvas;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';

  switch (estado) {
    case 'inicio':
      _texto(ctx, 'GALAXIA',                       w / 2, h / 2 - 70, '56px', '#00ff99');
      _texto(ctx, 'Presiona ENTER para jugar',      w / 2, h / 2,      '22px', '#ffffff');
      _texto(ctx, `Mejor puntuación: ${mejorPuntuacion}`, w / 2, h / 2 + 42, '18px', '#aaaaaa');
      break;

    case 'gameOver':
      _texto(ctx, 'GAME OVER',                      w / 2, h / 2 - 70, '56px', '#ff4444');
      _texto(ctx, `Puntuación: ${puntuacion}`,       w / 2, h / 2 - 10, '26px', '#ffffff');
      _texto(ctx, `Mejor: ${mejorPuntuacion}`,       w / 2, h / 2 + 34, '20px', '#aaaaaa');
      _texto(ctx, 'Presiona ENTER para reiniciar',   w / 2, h / 2 + 80, '18px', '#ffffff');
      break;
  }
}

/**
 * Registra ENTER para iniciar o reiniciar el juego.
 * @param {{ estado: EstadoMenu }} estadoRef
 * @param {() => void} onIniciar
 */
export function registrarControlesMenu(estadoRef, onIniciar) {
  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (estadoRef.estado === 'inicio' || estadoRef.estado === 'gameOver')) {
      onIniciar();
    }
  });
}

/** @private */
function _texto(ctx, texto, x, y, fuente, color) {
  ctx.font = `bold ${fuente} monospace`;
  ctx.fillStyle = color;
  ctx.fillText(texto, x, y);
}