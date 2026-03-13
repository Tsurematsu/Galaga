import cargarRecursos from "./cargarRecurso.js";
import cargarAudio from "./cargarAudio.js";
import Game from "./game.js";
import Jugador from "./jugador.js";
import Disparo from "./disparo.js";
import Enemigos from "./enemigos.js";
import hitBoxing from "./hitBoxing.js";
import UI from "./UI.js";
import Powers from "./powers.js";
import cargarRecursoSheet from "./cargarRecursoSheet.js";
async function main() {
    const loadAudio = await cargarAudio("./sonidos/My Hello Kitty Cafe Soundtrack -  Town.mp3");
    loadAudio.volume = 0.8;
    loadAudio.loop = true;
    loadAudio.play();
    
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('canvas#planoDibujo');
    const video = document.getElementById('videoApp')
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
        // nodoAudio: await cargarAudio("./sonidos/7.mpeg")
        nodoAudio: await cargarAudio("./sonidos/yomecerlm3-meow-460686.mp3")
    });

    const jugador = new Jugador({
        imagePlayer: await cargarRecursos("./imagenes/jugador1.png"),
        imageDestroy: await cargarRecursos("./imagenes/enemigoMuerto.jpeg"),
        escalado: 0.06
    });
    
    const powerUps = new Powers({
        nodoAudio: await cargarAudio("./sonidos/yey.mp3"),
        imagenPowerUp: (await cargarRecursoSheet({
            url: "./imagenes/powerUps.png",
            columnas: 6,
            filas: 6
        }))
    })

    const enemigos = new Enemigos({
        imagePlayer: await cargarRecursos("./imagenes/enemigo1.png"),
        nodoAudio: await cargarAudio("./sonidos/liecio-collect-points-190037.mp3"),
        nodoAudioDestroy: await cargarAudio("./sonidos/freesound_community-catmeow1-89814.mp3"),
        escalado: 0.19,
        separacion: 20,
        areaWidth: canvas.width - 100,
        areaHeight: canvas.height - 300,
        canvasMain: canvas
    })

    enemigos.onshot((pos) => {
        disparo.nuevaBala(pos.x + jugador.width / 2, pos.y, 1, "B", "black");
    })

    jugador.onShoot((pos) => {
        disparo.nuevaBala(pos.x + jugador.width / 2, pos.y, -1, "A");
    })

    game.loop(() => {

        if (enemigos.list.length == 0) {
            game.stop()
            ui.setWin() 
            video.src = "./videos/These_characters_should_congratulate_the_player_sa_3ae5632124.mp4"
            canvas.style = "backdrop-filter: blur(0px);"
            video.muted = false
        }

        const ColicionEnemigoBala = hitBoxing(disparo.list.filter(e=>e.tag === "A"), enemigos.list, 0, 0)
        disparo.removeBala(ColicionEnemigoBala.A);
        enemigos.removeEnemigo(ColicionEnemigoBala.B);

        const ColicionPlayerBala = hitBoxing(disparo.list.filter(e=>e.tag === "B"), [jugador], 0, 0)
        disparo.removeBala(ColicionPlayerBala.A);
        if(ColicionPlayerBala.A.length > 0){
            game.stop();
            ui.setGameOver();
        }
        

        const ColicionEnemigoJugador = hitBoxing([jugador], enemigos.list, 0, 10)
        ui.score += 10 * ColicionEnemigoBala.B.length;
        if (ColicionEnemigoJugador.A.length > 0) {
            game.stop();
            ui.setGameOver();
        }

        const ColicionPowerupJugador = hitBoxing([jugador], powerUps.list, 0, 0)
        powerUps.removePower(ColicionPowerupJugador.B)
        // if (ColicionPowerupJugador.B > 0) {
            
        // }
    })

    game.render((ctx, canvas, gameProperties) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        enemigos.render(ctx)
        jugador.render(ctx);
        disparo.render(ctx);
        powerUps.render(ctx);
        ui.render(ctx);
    });

    ui.onPlay(() => {
        video.src = "./videos/DAN DA DAN - Opening _ Otonoke de Creepy Nuts.mp4"
        canvas.style = "backdrop-filter: blur(30px);"
        video.muted = true

        jugador.x = canvas.width / 2 - jugador.width / 2
        jugador.y = canvas.height - jugador.height - 70
        enemigos.reset();
        disparo.reset();
        game.start();
        loadAudio.play();
    });

    // game.start();
}
main()


