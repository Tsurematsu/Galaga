export default class Jugador{
    x = 50;
    y = 50;
    width = 0;
    height = 0;

    velocidadBase = 5;

    
    constructor({imagePlayer, imageDestroy, escalado}){
        this.image = imagePlayer;
        this.imageDestroy = imageDestroy;
        this.escalado = escalado;
        this._CapturaTeclado();
        this.width = this.image.width * this.escalado;
        this.height = this.image.height * this.escalado;
    }

    _leftKey = false;
    _rightKey = false;
    _upKey = false;
    _downKey = false;
    _spaceKey = false;
    _generalPressed = true;
    _eventShoot = ()=>{};

    

    verify_status(){
        if(
            !this._leftKey && 
            !this._rightKey && 
            !this._upKey && 
            !this._downKey &&
            !this._spaceKey
        ) 
            this._generalPressed = false;
    }

    _asossiationKeys = {
        "ArrowLeft": (status)=>{this._leftKey = status},
        "ArrowRight": (status)=>this._rightKey = status,
        "ArrowUp": (status)=>this._upKey = status,
        "ArrowDown": (status)=>this._downKey = status,
        "Space": (status)=>this._spaceKey = status
    }

    
    // _asossiationKeys = {
    //     "KeyA": (status)=>{this._leftKey = status},
    //     "KeyD": (status)=>this._rightKey = status,
    //     "KeyW": (status)=>this._upKey = status,
    //     "KeyS": (status)=>this._downKey = status,
    //     "ArrowUp": (status)=>this._spaceKey = status
    // }

    _CapturaTeclado() {
        document.addEventListener("keydown", (event) => {
            this._generalPressed = true
            this._asossiationKeys[event.code]?.(true);
        });

        document.addEventListener("keyup", (event) => {
            this.verify_status();
            this._asossiationKeys[event.code]?.(false);
        });
    }

    timerShoot = 0;

    _LogicaMovimiento(){
        if(this._leftKey) this._restriccionMovimiento("left", () => this.x -= this.velocidadBase);
        if(this._rightKey) this._restriccionMovimiento("right", () => this.x += this.velocidadBase);
        if(this._upKey) this._restriccionMovimiento("up", () => this.y -= this.velocidadBase);
        if(this._downKey) this._restriccionMovimiento("down", () => this.y += this.velocidadBase);
        if(this._spaceKey) {
            this.timerShoot++;
            if(this.timerShoot >= 5){
                this._eventShoot({
                    x: this.x,
                    y: this.y
                });
                this.timerShoot = 0;
            }
        }else if(!this._spaceKey){
            this.timerShoot = 5
        };
    }

    _restriccionMovimiento(tag, callback){
        callback();
    }

    render(ctx) {
        this._LogicaMovimiento();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    onDestroyed(callback) {
        callback();
    }

    onShoot(callback){
        this._eventShoot = callback;
    }
}