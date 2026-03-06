import { crearBloqueEnemigos, actualizarEnemigos, dibujarEnemigos, enemigosVivos, iniciarMuerteEnemigo, bloqueTerminado } from './enemigos.js';
import { crearJugador, registrarControles, actualizarJugador, dibujarJugador } from './jugador.js';
import { crearListaDisparos, dispararJugador, actualizarDisparos, dibujarDisparos, revisarColisiones } from './disparos.js';
import { dibujarMenu, registrarControlesMenu } from './menu.js';

export function crearJuego(canvas, recursos) {
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

  // w y h se leen SIEMPRE del canvas para reflejar el tamaño actual
  const dim = () => ({ w: canvas.width, h: canvas.height });

  const estadoRef = { estado: /** @type {import('./menu.js').EstadoMenu} */ ('inicio') };
  let puntuacion = 0;
  let mejorPuntuacion = Number(localStorage.getItem('mejorPuntuacion')) || 0;
  let idFrame = 0;

  let jugador, bloque, disparos;

  function inicializar() {
    const { w, h } = dim();
    puntuacion = 0;
    estadoRef.estado = 'jugando';

    jugador = crearJugador({
      anchoCanvas: w, altoCanvas: h,
      ancho: 48, alto: 48,
      imagen: recursos.jugador,
    });
    registrarControles(jugador);

    bloque = crearBloqueEnemigos({
      filas: 4, columnas: 10,
      anchoEnemigo: 40, altoEnemigo: 32,
      espaciado: 14,
      imagen: recursos.enemigo,
      framesMuerte: recursos.framesMuerte,
    });

    disparos = crearListaDisparos();
  }

  function actualizar() {
    if (estadoRef.estado !== 'jugando') return;
    const { w, h } = dim();

    actualizarJugador(jugador, w);
    actualizarEnemigos(bloque, w);
    actualizarDisparos(disparos, h);

    revisarColisiones(
      disparos,
      enemigosVivos(bloque),
      enemigo => { iniciarMuerteEnemigo(enemigo); puntuacion += 10; }
    );

    if (enemigosVivos(bloque).some(e => e.y + e.alto >= jugador.y)) terminar();
    if (bloqueTerminado(bloque)) terminar();
  }

  function terminar() {
    if (puntuacion > mejorPuntuacion) {
      mejorPuntuacion = puntuacion;
      localStorage.setItem('mejorPuntuacion', String(mejorPuntuacion));
    }
    estadoRef.estado = 'gameOver';
  }

  function dibujar() {
    const { w, h } = dim();
    ctx.clearRect(0, 0, w, h);

    if (estadoRef.estado === 'jugando') {
      dibujarEnemigos(bloque, ctx);
      dibujarJugador(jugador, ctx);
      dibujarDisparos(disparos, ctx);

      ctx.font = '16px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`Puntos: ${puntuacion}`, 10, 24);
      ctx.textAlign = 'right';
      ctx.fillText(`Mejor: ${mejorPuntuacion}`, w - 10, 24);
    }

    if (estadoRef.estado !== 'jugando') {
      dibujarMenu(ctx, estadoRef.estado, puntuacion, mejorPuntuacion);
    }
  }

  function loop() {
    actualizar();
    dibujar();
    idFrame = requestAnimationFrame(loop);
  }

  registrarControlesMenu(estadoRef, inicializar);

  window.addEventListener('keydown', e => {
    if (e.code === 'Space' && estadoRef.estado === 'jugando') {
      dispararJugador(disparos, jugador);
    }
  });

  return {
    iniciar() { loop(); },
    detener() { cancelAnimationFrame(idFrame); },

    /**
     * Llamar cuando el canvas cambia de tamaño.
     * Si estaba jugando, reinicia la partida con las nuevas dimensiones.
     * Si estaba en menú, solo el próximo dibujo ya usará el nuevo tamaño.
     */
    redimensionar() {
      if (estadoRef.estado === 'jugando') {
        inicializar();
      }
      // En 'inicio' o 'gameOver' el menú se redibuija solo en el próximo frame
      // usando dim() que ya apunta al canvas actualizado
    },
  };
}