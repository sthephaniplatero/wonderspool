// Genera el QR (png + svg) y el cartel imprimible (cartel.html) para PUBLIC_URL.
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const out = path.join(__dirname, '..', 'frontend', 'public');
fs.mkdirSync(out, { recursive: true });

const url = process.env.PUBLIC_URL;
if (!url) throw new Error('Define PUBLIC_URL (ej. https://usuario.github.io/repo/)');

const opts = { errorCorrectionLevel: 'H', margin: 0, color: { dark: '#000000', light: '#ffffff' } };

const poster = (qrSvg) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Cartel QR | Wonder's Pool</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  html, body { background: #444; }
  body { font-family: 'Oswald','Arial Narrow',Impact,sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sheet {
    position: relative; overflow: hidden; width: 210mm; height: 297mm; margin: 0 auto;
    background: #000; color: #fff; text-align: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9mm;
  }
  .wave { position: absolute; width: 100%; height: 100%; inset: 0; z-index: 0; }
  .sheet > :not(.wave) { position: relative; z-index: 1; }
  .logo { font-size: 17mm; font-weight: 700; letter-spacing: .03em; line-height: 1; border-bottom: .9mm solid #fff; padding-bottom: 2mm; }
  .logo small { display: block; font-size: 5mm; font-weight: 300; letter-spacing: .25em; margin-top: 2mm; border: 0; }
  h1 { font-size: 22mm; font-weight: 300; line-height: .95; text-transform: uppercase; letter-spacing: .04em; }
  h1 b { color: #76d739; font-weight: 700; }
  .card {
    background: #fff; padding: 9mm; border-radius: 10mm; width: 100mm; height: 100mm;
    border: 2.5mm solid #76d739; box-shadow: 0 0 0 2mm #000, 0 0 0 3mm #76d739;
  }
  .card svg { width: 100%; height: 100%; display: block; }
  .pill { background: #76d739; color: #000; font-size: 9mm; padding: 2mm 14mm; border-radius: 99mm; text-transform: uppercase; letter-spacing: .05em; }
  .cta { font-size: 6.5mm; font-weight: 300; letter-spacing: .12em; text-transform: uppercase; }
  .cta b { color: #76d739; font-weight: 400; }
  .url { font-size: 4mm; color: #aaa; letter-spacing: .05em; word-break: break-all; max-width: 150mm; }
  .hint { text-align: center; color: #fff; font: 14px system-ui; padding: 10px; }
  @media print { html, body { background: none; } .hint { display: none; } }
</style>
</head>
<body>
<p class="hint">Imprime con Ctrl+P → tamaño A4, sin márgenes, activar “Gráficos de fondo”.</p>
<div class="sheet">
  <svg class="wave" viewBox="0 0 210 297" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0 H52 C44 14 40 24 28 24 C14 24 8 36 0 50 Z" fill="#76d739"/>
    <path d="M210 297 H160 C168 284 172 276 184 276 C198 276 204 264 210 252 Z" fill="#76d739"/>
    <path d="M190 -5 C198 14 186 24 196 36 C202 44 214 44 214 44" fill="none" stroke="#76d739" stroke-width="4" stroke-linecap="round"/>
    <path d="M-4 268 C10 262 18 276 30 274 C40 272 44 262 54 270" fill="none" stroke="#76d739" stroke-width="4" stroke-linecap="round"/>
  </svg>
  <div class="logo">WONDER'S POOL<small>SINCE 1997</small></div>
  <h1>Escanea<br>y mira nuestro <b>menú</b></h1>
  <div class="card">${qrSvg}</div>
  <div class="pill">La Estanzia</div>
  <div class="cta">Abre la cámara de tu <b>celular</b></div>
  <div class="url">${url}</div>
</div>
</body>
</html>`;

(async () => {
  const svg = await QRCode.toString(url, { ...opts, type: 'svg' });
  fs.writeFileSync(path.join(out, 'qr.svg'), svg);
  fs.writeFileSync(path.join(out, 'qr.png'), await QRCode.toBuffer(url, { ...opts, margin: 2, width: 1024 }));
  fs.writeFileSync(path.join(out, 'cartel.html'), poster(svg));
  console.log(`QR y cartel generados para ${url}`);
})();
