export default class Game {
    gameProperties = {
        playerSpeed: 5,
        status : "playing"
    };
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.lastTime = 0;
    }

    gameLoop(timestamp) {
        if (timestamp - this.lastTime > 1000 / 60) { // 60 FPS
            this.loopCallback(this.context, this.canvas, this.gameProperties);
            this.lastTime = timestamp;
        }
        if (this.gameProperties.status === "playing") {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    start(loopCallback) {
        this.loopCallback = loopCallback;
        this.gameProperties.status = "playing";
        requestAnimationFrame(this.gameLoop.bind(this));
    }

}