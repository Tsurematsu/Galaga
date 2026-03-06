export default class Enemigos {

    image = null;
    imageDestroy = null;
    escalado = null;

    width = null;
    height = null;
    x = 0;
    y = 0;

    speedWith = 2;
    speedHeight = 20;

    preRenderPlano = null;
    preRenderCtx = null;

    separacion = null;

    enemigos = []

    canvasMain = null;
    _cacheTemplate = []
    _eventMove = ()=>{}

    constructor(imagePlayer, imageDestroy, escalado, separacion, areaWidth, areaHeight, canvasMain) {
        this.canvasMain = canvasMain;
        this.image = imagePlayer;
        this.imageDestroy = imageDestroy;
        this.escalado = escalado;
        this.separacion = separacion;

        this.width = this.image.width * this.escalado;
        this.height = this.image.height * this.escalado;

        this.preRenderPlano = document.createElement("canvas");
        this.preRenderPlano.width = areaWidth;
        this.preRenderPlano.height = areaHeight;

        this.preRenderCtx = this.preRenderPlano.getContext("2d");

        const numFilas = Math.floor(this.preRenderPlano.width / (this.width + this.separacion));
        const numColumnas = Math.floor(this.preRenderPlano.height / (this.height + this.separacion));
        for (let fila = 0; fila < numColumnas; fila++) {
            for (let col = 0; col < numFilas; col++) {
                const x = col * (this.width + this.separacion);
                const y = fila * (this.height + this.separacion);
                this.enemigos.push({ x, y })
            }

        }
        this._cacheTemplate = JSON.parse(JSON.stringify(this.enemigos))
        this.prerender()
    }

    _reverseMode = true;

    prerender(){
        this.preRenderCtx.clearRect(
            0,
            0,
            this.preRenderPlano.width,
            this.preRenderPlano.height
        );
        for (const element of this.enemigos) {
            this.preRenderCtx.drawImage(
                this.image,
                element.x,
                element.y,
                this.width,
                this.height
            );
        }

    }


    render(ctx){
        for (let index = 0; index < this.enemigos.length; index++) {
            const enemigo = this.enemigos[index];
            const enemigo_tm = this._cacheTemplate[index];
            enemigo.x = enemigo_tm.x + this.x
            enemigo.y = enemigo_tm.y + this.y
            const removeEnemigo = ()=>{
                this.enemigos.splice(index, 1);
                this._cacheTemplate.splice(index, 1)
                this.prerender()
            }
            this._eventMove(enemigo, index, removeEnemigo)
            // if (index == 0) {
            //     console.clear()
            //     console.log(enemigo);
            //     console.log(enemigo_tm);
            // }
        }

        ctx.clearRect(
            this.x,
            this.y,
            this.preRenderPlano.width,
            this.preRenderPlano.height
        );


        if (this.x + this.preRenderPlano.width - this.separacion < this.canvasMain.width && this._reverseMode) {
            this.x += this.speedWith;
        }
  
        if (this.x > 0 && !this._reverseMode) {
            this.x -= this.speedWith;
        }

        if(this.x + this.preRenderPlano.width - this.separacion == this.canvasMain.width) {
            this._reverseMode = false
            if(this.y < this.canvasMain.height) this.y += this.speedHeight;
        };
        if(this.x == 0) {
            this._reverseMode = true
            if(this.y < this.canvasMain.height) this.y += this.speedHeight;
        };


        ctx.drawImage(
            this.preRenderPlano,
            this.x,
            this.y
        );

    }

    onMove(callback){
        this._eventMove = callback
    }

}