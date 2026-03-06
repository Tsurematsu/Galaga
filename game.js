export default class Game {
    _eventLoop = ()=>{};
    gameProperties = {
        playerSpeed: 5,
        status : "playing"
    };
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.lastTime = 0;
    }

    gameLoop(timestamp ) {
        if (timestamp - this.lastTime > 1000 / 60) { // 60 FPS
            if (this.gameProperties.status === "playing") this._eventLoop(this.context, this.canvas, this.gameProperties);
            this.loopCallback(this.context, this.canvas, this.gameProperties);
            this.lastTime = timestamp;
        }
        if (this.gameProperties.status === "playing") {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    render(loopCallback) {
        this.loopCallback = loopCallback;
        loopCallback(this.context, this.canvas, this.gameProperties);
    }

    start() {
        this.gameProperties.status = "playing";
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    stop() {
        this.gameProperties.status = "stopped";
    }

    loop(callbackLoop){
        this._eventLoop = callbackLoop;
    }

}