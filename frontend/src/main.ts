import './style.css';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const pdfUrl = `${import.meta.env.BASE_URL}menu.pdf`;
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div id="pages"><p class="loading">Cargando menú…</p></div>
  <a class="download" href="${pdfUrl}" download="Menu-Wonders-Pool.pdf">Descargar PDF</a>`;

async function render() {
  const pages = document.querySelector<HTMLDivElement>('#pages')!;
  const pdf = await pdfjs.getDocument({ url: pdfUrl }).promise;
  pages.innerHTML = '';

  const width = Math.min(window.innerWidth, 720);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: (width / base.width) * dpr });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.aspectRatio = `${base.width} / ${base.height}`;
    pages.appendChild(canvas);

    await page.render({ canvas, viewport }).promise;
  }
}

render().catch(() => {
  document.querySelector('#pages')!.innerHTML =
    `<p class="loading">No se pudo mostrar el menú. <a href="${pdfUrl}">Abrir PDF</a></p>`;
});
