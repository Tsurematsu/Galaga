export default class Disparo{
    list = [];
    volumen = 0.2;
    nodoAudio = null
    width = 5;
    height = 10;
    velocidad = 5;
    constructor({nodoAudio}) {
        this.nodoAudio = nodoAudio;
    }

    nuevaBala(x, y, gravity=-1, tag="A", color="pink"){
        const clonNodo = this.nodoAudio.cloneNode();
        clonNodo.volume = this.volumen;
        clonNodo.play();
        this.list.push({
            tag,
            color,
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            velocidad: gravity * this.velocidad,
        });
    } 

      removeBala(indices) {
        this.list = this.list.filter((_, i) => !indices.includes(i));
    }

    render(ctx) {
        this.list.forEach((bala, index) => {
            ctx.fillStyle = bala.color;
            bala.y += bala.velocidad;
            ctx.fillRect(bala.x, bala.y, bala.width, bala.height);
            // if (bala.y < -10 && bala.velocidad > 0) {
            //     this.list.splice(index, 1)
            // }
        });
    }

    reset() {
        this.list = [];
    }

    
}