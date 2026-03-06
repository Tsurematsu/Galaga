export default class Disparo{
    list = [];
    volumen = 0.2;
    nodoAudio = null
    constructor({nodoAudio}) {
        this.nodoAudio = nodoAudio;
    }

    nuevaBala(x, y){
        const clonNodo = this.nodoAudio.cloneNode();
        clonNodo.volume = this.volumen;
        clonNodo.play();
        this.list.push({
            x: x,
            y: y,
            width: 5,
            height: 10,
            velocidad: 5,
        });
    } 

      removeBala(indices) {
        this.list = this.list.filter((_, i) => !indices.includes(i));
    }

    render(ctx) {
        this.list.forEach((bala, index) => {
            ctx.fillStyle = "pink";
            bala.y -= bala.velocidad;
            ctx.fillRect(bala.x, bala.y, bala.width, bala.height);
            if (bala.y < -10) {
                this.list.splice(index, 1)
            }
        });
    }

    
}