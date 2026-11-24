import './style.css';

interface Item { name: string; price: number; note?: string }
interface Group { title?: string; items: Item[] }
interface Section {
  id: string;
  title: string;
  subtitle?: string;
  groups: Group[];
  featured?: Item[];
}
interface Menu { restaurant: string; since: number; location: string; sections: Section[] }

const base = import.meta.env.BASE_URL;
const img = (f: string) => `${base}img/${f}`;
const app = document.querySelector<HTMLDivElement>('#app')!;

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const money = (n: number) => `$${n.toFixed(2)}`;

/* Todas las posiciones están en unidades de la hoja original (924 × 1308). */
const at = (x: number, y: number, w?: number, extra = '') =>
  `style="--x:${x};--y:${y}${w ? `;--w:${w}` : ''}${extra ? ';' + extra : ''}"`;

/* ---------- Decoración (ondas verdes) ---------- */
const BLOB_TL =
  '<path d="M0 0H300C270 62 215 92 150 86C70 80 40 150 0 255Z"/>';
const BLOB_BR =
  '<path d="M924 1308H695C730 1235 785 1190 850 1198C885 1203 908 1190 924 1160Z"/>';

const deco = (inner: string) =>
  `<svg class="deco" viewBox="0 0 924 1308" preserveAspectRatio="none" aria-hidden="true">${inner}</svg>`;

const COVER_DECO = deco(`
  <path d="M0 0H370C335 62 300 150 225 185C150 185 110 178 62 250C40 290 20 335 0 372Z"/>
  <path d="M924 995C885 1070 845 1128 785 1128C725 1128 692 1160 652 1232C632 1265 612 1290 596 1308H924Z"/>
  <path class="ribbon" d="M520 12C528 62 600 70 688 66C745 70 722 135 702 200C682 270 700 300 760 318C830 335 880 355 896 432C908 500 884 545 924 572"/>
  <path class="ribbon" d="M0 1032C60 1020 112 1062 172 1090C242 1112 272 1050 302 962C322 920 340 912 362 910"/>`);

const logo = (x = 700, y = 45, w = 200) =>
  `<img class="logo abs" src="${img('logo.png')}" alt="Wonder's Pool" ${at(x, y, w)}>`;

const num = (n: number) => `<span class="num">${n}</span>`;

const page = (id: string, inner: string, opts: { cover?: boolean; n?: number } = {}) => `
  <section class="page" id="${id}">
    <div class="canvas">
      ${opts.cover ? COVER_DECO : deco(BLOB_TL + BLOB_BR)}
      ${inner}
      ${opts.n ? num(opts.n) : ''}
    </div>
  </section>`;

/* ---------- Listas ---------- */
interface Row { name: string; price: number; sub?: boolean }

/** "Pilsener grande" después de "Pilsener" pasa a una línea secundaria "Grande". */
function rowsOf(items: Item[]): Row[] {
  const out: Row[] = [];
  for (const it of items) {
    const prev = out[out.length - 1];
    const m = /^(.*)\s+grande$/i.exec(it.name);
    if (m && prev && prev.name.toLowerCase() === m[1].toLowerCase()) {
      out.push({ name: 'Grande', price: it.price, sub: true });
    } else if (/^Hamburguesa sin/i.test(it.name)) {
      out.push({ name: it.name, price: it.price, sub: true });
    } else out.push({ name: it.name, price: it.price });
  }
  return out;
}

function list(rows: Row[], x: number, y: number, nameW: number, opts: { row?: number; fs?: number } = {}) {
  const li = rows
    .map(
      (r) => `
      <li class="${r.sub ? 'sub' : ''}"><span class="n">${esc(r.name)}</span><span class="p">${money(r.price)}</span></li>`,
    )
    .join('');
  return `<ul class="list abs" ${at(x, y, undefined, `--nw:${nameW};--row:${opts.row ?? 57};--fs:${opts.fs ?? 40}`)}>${li}</ul>`;
}

const sub = (t: string, x: number, y: number, w: number) =>
  `<h3 class="abs serif" ${at(x, y, w)}>${esc(t)}</h3>`;

const photo = (file: string, x: number, y: number, w: number, cls = '') =>
  `<img class="abs photo ${cls}" src="${img(file)}" alt="" loading="lazy" ${at(x, y, w)}>`;

const feature = (name: string, price: number, x: number, y: number, w: number, cls = '') => `
  <div class="abs feat ${cls}" ${at(x, y, w)}>
    <span class="fname">${esc(name)}</span>
    <span class="fprice">${money(price)}</span>
  </div>`;

/* ---------- Páginas ---------- */
const itemsOf = (s: Section) => s.groups.flatMap((g) => g.items);

function cover() {
  const cell = (f: string) => `<div><img src="${img(f)}" alt=""></div>`;
  return page(
    'inicio',
    `${logo()}
     <h1 class="abs big" ${at(0, 160, 924)}>Menú</h1>
     <div class="diamond abs" ${at(462, 700)}>
       ${cell('sopa-cover.png')}${cell('burger.png')}${cell('papas.png')}${cell('ceviche.png')}
     </div>
     <span class="pill abs" ${at(325, 1073, 300)}>La Estanzia</span>`,
    { cover: true },
  );
}

function boquitas(s: Section) {
  const all = itemsOf(s);
  const nachos = s.featured?.[0];
  return page(
    s.id,
    `${logo()}
     <h1 class="abs big" ${at(0, 125, 924)}>${esc(s.title)}</h1>
     ${list(rowsOf(all.slice(0, 8)), 93, 322, 258, { row: 57.5 })}
     ${photo('medallones.png', 520, 207, 400)}
     ${photo('costillas.png', 535, 511, 400)}
     ${photo('deditos.png', 400, 733, 415)}
     ${list(rowsOf(all.slice(8)), 385, 975, 265, { row: 58 })}
     <div class="abs crop" ${at(-5, 828, 345)}><img src="${img('nachos.png')}" alt=""></div>
     ${nachos ? feature(nachos.name, nachos.price, 40, 1150, 260, 'left') : ''}`,
    { n: 1 },
  );
}

function platoFuerte(s: Section) {
  const [pizza, sopa] = [
    s.featured?.find((f) => /pizza/i.test(f.name)),
    s.featured?.find((f) => /sopa/i.test(f.name)),
  ];
  return page(
    s.id,
    `${logo()}
     <h1 class="abs big" ${at(0, 125, 924)}>Plato</h1>
     <span class="abs script" ${at(0, 252, 924)}>fuerte</span>
     ${list(rowsOf(itemsOf(s)), 93, 420, 352, { row: 58 })}
     ${photo('pizza.png', 450, 140, 560)}
     ${photo('tacos.png', 445, 731, 500)}
     ${photo('sopa.png', -65, 835, 560)}
     ${pizza ? feature(pizza.name, pizza.price, 700, 590, 224, 'right sm') : ''}
     ${sopa ? feature(sopa.name, sopa.price, 340, 1115, 330, 'center') : ''}`,
    { n: 2 },
  );
}

function cervezas(s: Section) {
  const [intl, nac] = s.groups;
  return page(
    s.id,
    `${logo()}
     <h1 class="abs big" ${at(0, 160, 924)}>${esc(s.title)}</h1>
     <img class="abs beer" src="${img('cerveza.png')}" alt="" loading="lazy" ${at(-50, 595, 1070)}>
     ${sub(intl.title ?? '', 105, 355, 300)}
     ${list(rowsOf(intl.items), 93, 425, 223, { row: 57 })}
     ${sub(nac.title ?? '', 508, 355, 300)}
     ${list(rowsOf(nac.items), 508, 440, 220, { row: 56 })}`,
    { n: 3 },
  );
}

function sinAlcohol(s: Section) {
  const [sin, latas, esp] = s.groups;
  return page(
    s.id,
    `${logo()}
     <h1 class="abs big" ${at(0, 160, 924)}>${esc(s.title)}</h1>
     <img class="abs beer" src="${img('cerveza.png')}" alt="" loading="lazy" ${at(-50, 595, 1070)}>
     ${sub(sin.title ?? '', 112, 355, 300)}
     ${list(rowsOf(sin.items), 112, 415, 266, { row: 56 })}
     ${sub(latas.title ?? '', 512, 355, 300)}
     ${list(rowsOf(latas.items), 512, 415, 224, { row: 56 })}
     ${sub(esp.title ?? '', 112, 795, 300)}
     ${list(rowsOf(esp.items), 112, 860, 232, { row: 56 })}`,
    { n: 4 },
  );
}

function closing() {
  return page(
    'fin',
    `${logo(180, 330, 560)}
     <span class="pill abs" ${at(308, 872, 300)}>La Estanzia</span>`,
    {},
  );
}

const LABELS: Record<string, string> = {
  inicio: 'Inicio',
  boquitas: 'Boquitas',
  'plato-fuerte': 'Plato fuerte',
  cervezas: 'Cervezas',
  'sin-alcohol': 'Bebidas',
};

function render(m: Menu) {
  const by = (id: string) => m.sections.find((s) => s.id === id)!;
  const ids = ['inicio', 'boquitas', 'plato-fuerte', 'cervezas', 'sin-alcohol'];
  app.innerHTML = `
    <nav class="tabs" aria-label="Categorías">
      ${ids.map((id) => `<a href="#${id}">${LABELS[id]}</a>`).join('')}
    </nav>
    <main>
      ${cover()}
      ${boquitas(by('boquitas'))}
      ${platoFuerte(by('plato-fuerte'))}
      ${cervezas(by('cervezas'))}
      ${sinAlcohol(by('sin-alcohol'))}
      ${closing()}
    </main>
    <footer><a href="${base}menu.pdf" download="Menu-Wonders-Pool.pdf">Descargar PDF</a></footer>`;

  const tabs = Array.from(app.querySelectorAll<HTMLAnchorElement>('.tabs a'));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        tabs.forEach((t) => {
          const on = t.hash === `#${e.target.id}`;
          t.classList.toggle('on', on);
          if (on) {
            const bar = t.parentElement!;
            bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: 'auto' });
          }
        });
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  app.querySelectorAll('.page').forEach((p) => io.observe(p));
}

fetch(`${base}menu.json`)
  .then((r) => r.json())
  .then(render)
  .catch((e) => {
    console.error(e);
    app.innerHTML = `<p class="loading">No se pudo cargar el menú. <a href="${base}menu.pdf">Abrir PDF</a></p>`;
  });
