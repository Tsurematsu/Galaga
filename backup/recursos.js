/**
 * Carga una imagen y elimina su fondo blanco (o cualquier color claro),
 * devolviendo un ImageBitmap listo para dibujar.
 * @param {string} src
 * @param {number} [umbral=240] - sensibilidad (0-255), mayor = elimina más blancos
 * @returns {Promise<ImageBitmap>}
 */
export async function cargarImagenSinFondo(src, umbral = 240) {
  const img = await _cargarImagen(src);

  const canvas = document.createElement('canvas');
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Si el pixel es "casi blanco" lo volvemos transparente
    if (r >= umbral && g >= umbral && b >= umbral) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return createImageBitmap(canvas);
}

/**
 * Carga un spritesheet horizontal y devuelve los frames como ImageBitmap[].
 * Todos los frames tienen el mismo ancho: spritesheet.width / totalFrames
 * @param {string} src
 * @param {number} totalFrames
 * @param {number} [umbral=240]
 * @returns {Promise<ImageBitmap[]>}
 */
export async function cargarSpritesheet(src, totalFrames, umbral = 240) {
  const img = await _cargarImagen(src);

  const anchoFrame = Math.floor(img.naturalWidth / totalFrames);
  const alto       = img.naturalHeight;

  // Dibujamos el sheet en offscreen para quitar fondo
  const sheet = document.createElement('canvas');
  sheet.width  = img.naturalWidth;
  sheet.height = alto;
  const sheetCtx = /** @type {CanvasRenderingContext2D} */ (sheet.getContext('2d'));
  sheetCtx.drawImage(img, 0, 0);

  const imageData = sheetCtx.getImageData(0, 0, sheet.width, alto);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] >= umbral && data[i + 1] >= umbral && data[i + 2] >= umbral) {
      data[i + 3] = 0;
    }
  }
  sheetCtx.putImageData(imageData, 0, 0);

  // Recortamos cada frame individualmente
  const frames = await Promise.all(
    Array.from({ length: totalFrames }, (_, i) =>
      createImageBitmap(sheet, i * anchoFrame, 0, anchoFrame, alto)
    )
  );

  return frames;
}

/** @private */
function _cargarImagen(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
  });
}