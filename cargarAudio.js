export default function cargarAudio(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url); // url se puede pasar directo al constructor
    audio.addEventListener("canplaythrough", () => resolve(audio));
    audio.addEventListener("error", reject);
  });
}