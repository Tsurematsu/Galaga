export default class Enemigos {

    image = null;
    nodoAudio = null;
    nodoAudioDestroy = null;
    escalado = null;

    width = null;
    height = null;
    x = 0;
    y = 0;
    lives = 2;

    speedWith = 3;
    speedHeight = 20;

    preRenderPlano = null;
    preRenderCtx = null;

    separacion = null;

    list = []

    canvasMain = null;
    _cacheTemplate = []

    constructor({
            imagePlayer, 
            nodoAudio, 
            nodoAudioDestroy, 
            escalado, 
            separacion, 
            areaWidth, 
            areaHeight, 
            canvasMain
        }) {
        this.canvasMain = canvasMain;
        this.image = imagePlayer;
        this.nodoAudio = nodoAudio;
        this.nodoAudioDestroy = nodoAudioDestroy;
        this.escalado = escalado;
        this.separacion = separacion;

        this.width = this.image.width * this.escalado;
        this.height = this.image.height * this.escalado;

        this.preRenderPlano = document.createElement("canvas");
        this.preRenderPlano.width = areaWidth;
        this.preRenderPlano.height = areaHeight;

        this.preRenderCtx = this.preRenderPlano.getContext("2d");

        this.makeTemplate();
    }

    makeTemplate() { 
        const numFilas = Math.floor(this.preRenderPlano.width / (this.width + this.separacion));
        const numColumnas = Math.floor(this.preRenderPlano.height / (this.height + this.separacion));
        for (let fila = 0; fila < numColumnas; fila++) {
            for (let col = 0; col < numFilas; col++) {
                const x = col * (this.width + this.separacion);
                const y = fila * (this.height + this.separacion);
                this.list.push({
                    x,
                    y,
                    width: this.width,
                    height: this.height,
                    lives: this.lives
                })
            }

        }
        this._cacheTemplate = JSON.parse(JSON.stringify(this.list))
        this.prerender()
    }

    _reverseMode = true;

    prerender() {
        this.preRenderCtx.clearRect(0, 0, this.preRenderPlano.width, this.preRenderPlano.height);
        for (const element of this.list) {
            this.preRenderCtx.drawImage(
                this.image,
                element.x,
                element.y,
                this.width,
                this.height
            );
        }

    }

    removeEnemigo(iArray) {


        this.list = this.list.filter((_, i) => {
            if (iArray.includes(i)) {
                if(this.list[i].lives > 1){
                    const clonNodo = this.nodoAudio.cloneNode();
                    clonNodo.volume = 0.5;
                    clonNodo.play();
                    this.list[i].lives -= 1;
                    return true; // mantiene
                }
                
                const clonNodo = this.nodoAudioDestroy.cloneNode();
                clonNodo.volume = 0.3;
                clonNodo.play();

                const enemigo_tm = this._cacheTemplate[i];
                this.preRenderCtx.clearRect(enemigo_tm.x - 2, enemigo_tm.y - 2, this.width + 4, this.height + 4);
                return false; // elimina
            }
            return true; // mantiene
        });
        
        this._cacheTemplate = this._cacheTemplate.filter((_, i) => {
            if (iArray.includes(i)){
                if(this._cacheTemplate[i].lives > 1){
                    this._cacheTemplate[i].lives -= 1;
                    return true; // mantiene
                }else if(this._cacheTemplate[i].lives < 0){
                    return false; // elimina
                }
            }else{
                return true; // mantiene
            }
        });

        
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.list = [];
        this._cacheTemplate = [];
        this.makeTemplate();
        this.list = JSON.parse(JSON.stringify(this._cacheTemplate));
        this.prerender();
    }

    render(ctx) {

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

        if (this.x + this.preRenderPlano.width - this.separacion == this.canvasMain.width) {
            this._reverseMode = false
            if (this.y < this.canvasMain.height) this.y += this.speedHeight;
        };
        if (this.x == 0) {
            this._reverseMode = true
            if (this.y < this.canvasMain.height) this.y += this.speedHeight;
        };

        for (let index = 0; index < this.list.length; index++) {
            const enemigo = this.list[index];
            const enemigo_tm = this._cacheTemplate[index];
            enemigo.x = enemigo_tm.x + this.x
            enemigo.y = enemigo_tm.y + this.y
        }

        ctx.drawImage(
            this.preRenderPlano,
            this.x,
            this.y
        );

    }

}