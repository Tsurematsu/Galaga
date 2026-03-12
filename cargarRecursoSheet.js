export default function cargarRecursoSheet({ url, columnas, filas }) {
    return new Promise((resolve, reject) => {
        const elementoCanvas = document.createElement("canvas");
        const ctx = elementoCanvas.getContext("2d");
        const listaImagenes = [];
        const img = new Image();
        img.onload = () => {
            const ancho = img.width / columnas;
            const alto = img.height / filas;
            elementoCanvas.width = ancho;
            elementoCanvas.height = alto;

            for (let j = 0; j < filas; j++) {
                for (let i = 0; i < columnas; i++) {
                    ctx.clearRect(0, 0, ancho, alto);
                    ctx.drawImage(img, ancho * i, alto * j, ancho, alto, 0, 0, ancho, alto);
                    const tempImage = new Image();
                    tempImage.src = elementoCanvas.toDataURL();
                    listaImagenes.push(tempImage);
                }
            }
            resolve(listaImagenes);
        };
        img.onerror = reject;
        img.crossOrigin = "anonymous"; // ✅ evita errores CORS con toDataURL
        img.src = url;
    });
}