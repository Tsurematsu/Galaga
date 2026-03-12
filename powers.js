export default class Powers {
    list = [];
    volumen = 0.2;
    nodoAudio = null
    imagenPowerUp = [];
    scale = 0.4;
    width = 0;
    height = 0;
    velocidad = 2;
    constructor({nodoAudio, imagenPowerUp}) {
        this.nodoAudio = nodoAudio;
        this.imagenPowerUp = imagenPowerUp;
        if(this.imagenPowerUp.length > 0) {
            this.width = this.imagenPowerUp[0].width * this.scale;
            this.height = this.imagenPowerUp[0].height * this.scale;
        }
    }

    nuevoPower(x, y){
        const imgIndex = Math.floor(Math.random() * this.imagenPowerUp.length);
        const imagen = this.imagenPowerUp[imgIndex]
        this.list.push({
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            velocidad: this.velocidad,
            imagen,
            imagenIndex: imgIndex
        });
    }

    _timeCounter = 0;

    render(ctx) {
        this._timeCounter++;
        if (this._timeCounter > 100) {
            this.nuevoPower(Math.random() * (ctx.canvas.width - this.width), -10);
            this._timeCounter = 0;
        }
        this.list.forEach((power, index) => {
            ctx.fillStyle = "pink";
            power.y += power.velocidad;
            ctx.drawImage(power.imagen, power.x, power.y, power.width, power.height);
            if (power.y > ctx.canvas.height + 10) this.list.splice(index, 1)
        });
    }

    reset() {
        this.list = [];
    }

    removePower(indices) {
        // const clonNodo = this.nodoAudio.cloneNode();
        // clonNodo.volume = this.volumen;
        // clonNodo.play();
        this.list = this.list.filter((_, i) => !indices.includes(i));
    }
}