export default class UI {
    score = 0;
    lives = 3;

    screenSelect = 1;
    _eventPlay = ()=>{};

    onPlay(callback){
        this._eventPlay = callback;
    }

    setGameOver(){
        this.screenSelect = 2;
    }

    setHome(){
        this.screenSelect = 1;
    }

    setWin(){
        this.screenSelect = 3;
    }

    constructor(){
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {

                if(this.screenSelect==1){
                    this.screenSelect = 0;
                    this._eventPlay();
                }

                else if(this.screenSelect == 2){
                    this.screenSelect = 1;
                    this._eventPlay();
                }

                else if(this.screenSelect == 3){
                    this.screenSelect = 1;
                    this._eventPlay();
                }

            }
        });
    }
    
    homeScreen(ctx){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GALAGA", ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);

        ctx.font = "30px Arial";
        ctx.fillText("Presiona Enter para jugar", ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
    }

    interfazJuego(ctx){
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";

        ctx.fillText(`Score: ${this.score}`, 20, 30);
        ctx.fillText(`Lives: ${this.lives}`, 20, 60);
    }

    gameOverScreen(ctx){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";

        ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    winScreen(ctx){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "lime";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";

        ctx.fillText("YOU WIN!", ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);

        ctx.font = "25px Arial";
        ctx.fillText(`Score Final: ${this.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);

        ctx.fillText("Presiona Enter para volver", ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);
    }

    listScenes = [
        (ctx)=> this.interfazJuego(ctx), // 0
        (ctx)=> this.homeScreen(ctx),    // 1
        (ctx)=> this.gameOverScreen(ctx),// 2
        (ctx)=> this.winScreen(ctx)      // 3
    ]
    
    render(ctx){
        this.listScenes[this.screenSelect]?.(ctx);
    }
}