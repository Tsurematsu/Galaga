import cargarRecursos from "./cargarRecurso.js";
import Game from "./game.js";
import Jugador from "./jugador.js";
import Disparo from "./disparo.js";
import Enemigos from "./enemigos.js";
async function main() {
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
    const game = new Game(canvas, context);
    const disparo = new Disparo();

    const jugador = new Jugador( 
        await cargarRecursos("./imagenes/jugador1.png"), 
        await cargarRecursos("./imagenes/enemigoMuerto.jpeg"),
        0.06
    );

    jugador.x = canvas.width / 2 - jugador.width / 2
    jugador.y = canvas.height - jugador.height - 70


    const enemigos = new Enemigos(
        await cargarRecursos("./imagenes/enemigo1.png"),
        await cargarRecursos("./imagenes/enemigoMuerto.jpeg"),
        0.19,
        20,
        canvas.width - 100,
        canvas.height - 300,
        canvas
    )

    let tempBala = null
    disparo.onEventMove((bala, removeBala)=>{
        tempBala = bala;

        if (bala.y < 300) {
            removeBala()
        }
    })

    enemigos.onMove((enemigo, index, removeEnemigo)=>{
        
        // if (
        //     bala.x > enemigo.x &&
        //     bala.x < enemigo.x + enemigo.width &&
        //     bala.y > enemigo.y &&
        //     bala.y < enemigo.y + enemigo.height
        // ) {
        //     console.log("eventp");
            
        //     // removeEnemigo();
        //     // removeBala();
        // }
    })

    

    
    jugador.onShoot((pos) => {
        disparo.nuevaBala(pos.x + jugador.width / 2, pos.y);
    })

    jugador.onDestroyed(() => {

    });

    game.start((ctx, canvas, gameProperties) => {
        enemigos.render(ctx)
        jugador.draw(ctx);
        disparo.render(ctx, canvas);
    });
}
main()


