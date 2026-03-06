import cargarRecursos from "./cargarRecurso.js";
import cargarAudio from "./cargarAudio.js";
import Game from "./game.js";
import Jugador from "./jugador.js";
import Disparo from "./disparo.js";
import Enemigos from "./enemigos.js";
import hitBoxing from "./hitBoxing.js";
import UI from "./ui.js";
async function main() {
    const loadAudio = await cargarAudio("./sonidos/My Hello Kitty Cafe Soundtrack -  Town.mp3");
    loadAudio.volume = 0.8;
    loadAudio.loop = true;
    loadAudio.play();
    
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('canvas#planoDibujo');
    const context = canvas.getContext('2d');

    // Estalbecer el tamaño del canvas
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    // Tamaño visual
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Tamaño real interno
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Escalar contexto
    context.scale(dpr, dpr);
    const game = new Game(
        canvas, 
        context
    );

    const ui = new UI();

    const disparo = new Disparo({
        nodoAudio: await cargarAudio("./sonidos/7.mpeg")
    });

    const jugador = new Jugador(
        await cargarRecursos("./imagenes/jugador1.png"),
        await cargarRecursos("./imagenes/enemigoMuerto.jpeg"),
        0.06
    );
    

    const enemigos = new Enemigos(
        await cargarRecursos("./imagenes/enemigo1.png"),
        await cargarAudio("./sonidos/3.mpeg"),
        0.19,
        20,
        canvas.width - 100,
        canvas.height - 300,
        canvas
    )

    jugador.onShoot((pos) => {
        disparo.nuevaBala(pos.x + jugador.width / 2, pos.y);
    })

    game.loop(() => {
        const ColicionEnemigoBala = hitBoxing(disparo.list, enemigos.list, 0, 0)
        disparo.removeBala(ColicionEnemigoBala.A);
        enemigos.removeEnemigo(ColicionEnemigoBala.B);
        const ColicionEnemigoJugador = hitBoxing([jugador], enemigos.list, 0, 10)
        ui.score += 10 * ColicionEnemigoBala.B.length;
        
        if (ColicionEnemigoJugador.A.length > 0) {
            game.stop();
            ui.setGameOver();
        }
    })

    game.render((ctx, canvas, gameProperties) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        enemigos.render(ctx)
        jugador.render(ctx);
        disparo.render(ctx);
        ui.render(ctx);
    });

    ui.onPlay(() => {
        jugador.x = canvas.width / 2 - jugador.width / 2
        jugador.y = canvas.height - jugador.height - 70
        enemigos.reset();
        disparo.reset();
        game.start();
    });

    // game.start();
}
main()


