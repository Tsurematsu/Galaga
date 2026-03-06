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

    listScenes = [
        (ctx)=> this.interfazJuego(ctx),
        (ctx)=> this.homeScreen(ctx),
        (ctx)=> this.gameOverScreen(ctx)
    ]
    
    render(ctx){
        this.listScenes[this.screenSelect]?.(ctx);
    }
}