export default class Disparo{
    balas = [];

    _evenMove = ()=>{}

    nuevaBala(x, y){
        this.balas.push({
            x: x,
            y: y,
            velocidad: 5
        });
    } 
    render(ctx) {
        this.balas.forEach((bala, index) => {
            const removeBala = ()=>{
                ctx.clearRect(bala.x - 1, bala.y - 1, 7, 12);
                this.balas.splice(index, 1)
            }
            this._evenMove(bala, removeBala)
            ctx.fillStyle = "pink";
            ctx.clearRect(bala.x - 1, bala.y - 1, 7, 12);
            bala.y -= bala.velocidad;
            ctx.fillRect(bala.x, bala.y, 5, 10);
            if (bala.y < -10) this.balas.splice(index, 1)
        });
    }

    onEventMove(callback){
        this._evenMove = callback
    }
}