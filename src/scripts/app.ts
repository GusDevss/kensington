/**
 * Interacciones del sitio — vanilla TS, sin dependencias.
 * Cada bloque se activa sólo si existe su marcado (data-*).
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

/* ---------- Revelado al hacer scroll ---------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealIO.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
);
$$('[data-reveal], .scribble').forEach((el) => revealIO.observe(el));

/* ---------- Header con sombra al hacer scroll ---------- */
const header = document.querySelector('[data-header]');
if (header) {
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting), { rootMargin: '-60px 0px 0px 0px' }).observe(sentinel);
}

/* ---------- Menús desplegables (navegación e idioma) ---------- */
const dropdowns = $$('[data-dropdown]');
const closeAll = (except?: Element) =>
  dropdowns.forEach((d) => {
    if (d === except) return;
    d.classList.remove('is-open');
    d.querySelector('[data-dropdown-trigger]')?.setAttribute('aria-expanded', 'false');
  });
dropdowns.forEach((dd) => {
  const trigger = dd.querySelector<HTMLElement>('[data-dropdown-trigger]');
  if (!trigger) return;
  const set = (open: boolean) => {
    if (open) closeAll(dd);
    dd.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    set(!dd.classList.contains('is-open'));
  });
  if (dd.hasAttribute('data-hover') && window.matchMedia('(hover: hover)').matches) {
    let t: number | undefined;
    dd.addEventListener('pointerenter', () => { clearTimeout(t); set(true); });
    dd.addEventListener('pointerleave', () => { t = window.setTimeout(() => set(false), 140); });
  }
  dd.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { set(false); trigger.focus(); }
  });
  dd.addEventListener('focusout', (e) => {
    if (!dd.contains(e.relatedTarget as Node)) set(false);
  });
});
document.addEventListener('click', () => closeAll());

/* ---------- Diálogos con animación de entrada/salida ---------- */
function openDialog(dlg: HTMLDialogElement, opener?: HTMLElement | null) {
  if (dlg.open) return;
  dlg.showModal();
  document.body.classList.add('is-locked');
  opener?.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-in')));
  (dlg as any)._opener = opener;
}
function closeDialog(dlg: HTMLDialogElement) {
  if (!dlg.open || dlg.dataset.closing) return;
  dlg.dataset.closing = '1';
  dlg.classList.remove('is-in');
  const done = () => {
    dlg.close();
    delete dlg.dataset.closing;
    document.body.classList.remove('is-locked');
    const opener = (dlg as any)._opener as HTMLElement | undefined;
    opener?.setAttribute('aria-expanded', 'false');
    opener?.focus();
    dlg.dispatchEvent(new Event('k:closed'));
  };
  if (reduceMotion) done();
  else setTimeout(done, 380);
}
$$<HTMLDialogElement>('dialog').forEach((dlg) => {
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(dlg); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closeDialog(dlg); } });
  dlg.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === dlg || target.closest('[data-close-dialog]')) closeDialog(dlg);
  });
});

const drawer = document.getElementById('drawer') as HTMLDialogElement | null;
$$('[data-open-drawer]').forEach((b) => b.addEventListener('click', () => drawer && openDialog(drawer, b)));
drawer?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a[href^="/"]')) closeDialog(drawer);
});

/* ---------- Buscador ---------- */
const search = document.getElementById('search') as HTMLDialogElement | null;
if (search) {
  const input = search.querySelector<HTMLInputElement>('input[type="search"]')!;
  const list = search.querySelector<HTMLUListElement>('.search__results')!;
  type Entry = { t: string; u: string; d: string; x: string };
  let index: Entry[] | null = null;
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const load = async () => {
    if (index) return index;
    const res = await fetch(search.dataset.index!);
    index = (await res.json()) as Entry[];
    return index;
  };
  const snippet = (text: string, q: string) => {
    const i = norm(text).indexOf(q);
    if (i < 0) return '';
    const start = Math.max(0, i - 60);
    const raw = (start > 0 ? '…' : '') + text.slice(start, i + q.length + 90) + '…';
    const ni = norm(raw).indexOf(q);
    return esc(raw.slice(0, ni)) + '<mark>' + esc(raw.slice(ni, ni + q.length)) + '</mark>' + esc(raw.slice(ni + q.length));
  };
  const render = async () => {
    const q = norm(input.value.trim());
    if (q.length < 2) { list.innerHTML = input.value ? `<li class="search__empty">${search.dataset.hint}</li>` : ''; return; }
    const data = await load();
    const hits = data
      .map((e) => ({ e, score: (norm(e.t).includes(q) ? 3 : 0) + (norm(e.d).includes(q) ? 2 : 0) + (norm(e.x).includes(q) ? 1 : 0) }))
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    list.innerHTML = hits.length
      ? hits.map(({ e }) => `<li><a href="${e.u}"><strong>${esc(e.t)}</strong><span>${snippet(e.x, q) || esc(e.d)}</span></a></li>`).join('')
      : `<li class="search__empty">${search.dataset.empty} “${esc(input.value)}”</li>`;
  };
  input.addEventListener('input', render);
  $$('[data-open-search]').forEach((b) =>
    b.addEventListener('click', () => {
      openDialog(search, b);
      load();
      setTimeout(() => input.focus(), 50);
    }),
  );
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !(e.target as HTMLElement).closest('input,textarea'))) {
      e.preventDefault();
      openDialog(search);
      setTimeout(() => input.focus(), 50);
    }
  });
}

/* ---------- Acordeones ---------- */
// data-accordion="single": sólo una pregunta abierta. data-acc-group agrupa varios
// acordeones (p. ej. dos columnas) para que también se cierren entre sí.
$$('[data-accordion]').forEach((acc) => {
  const group = acc.closest<HTMLElement>('[data-acc-group]');
  const single = acc.dataset.accordion === 'single' || !!group;
  const scope = group ?? acc;
  $$<HTMLButtonElement>('[data-acc-trigger]', acc).forEach((btn) =>
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      if (single && open) $$<HTMLButtonElement>('[data-acc-trigger]', scope).forEach((b) => b !== btn && b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(open));
    }),
  );
});

/* ---------- Pestañas ---------- */
$$('[data-tabs]').forEach((root) => {
  const tabs = $$<HTMLButtonElement>('[role="tab"]', root).filter((t) => t.closest('[data-tabs]') === root);
  const select = (tab: HTMLButtonElement, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls')!);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (dir) { e.preventDefault(); select(tabs[(i + dir + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });
});

/* ---------- Carruseles: scroll-snap nativo, ciclo infinito y avance automático ----------
 * data-carousel            raíz
 * data-autoplay="5000"     ms entre avances (0 = sin avance automático)
 * [data-track]             contenedor con scroll horizontal (hijos = diapositivas)
 * [data-prev] [data-next]  botones · [data-dots] contenedor de puntos · [data-counter] "3 / 8"
 * El avance se pausa con el cursor encima, con foco dentro, si la pestaña está oculta
 * o si el carrusel no está en pantalla. */
$$('[data-carousel]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const counter = root.querySelector<HTMLElement>('[data-counter]');
  const dotsBox = root.querySelector<HTMLElement>('[data-dots]');
  const slides = Array.from(track.children) as HTMLElement[];
  const n = slides.length;
  const interval = reduceMotion ? 0 : Number(root.dataset.autoplay || 0);
  let clones: HTMLElement[] = [];
  let looping = false;

  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
  const visible = () => Math.max(1, Math.round(track.clientWidth / step()));
  const index = () => ((Math.round(track.scrollLeft / step()) % n) + n) % n;

  // Puntos de navegación
  const dots: HTMLButtonElement[] = [];
  if (dotsBox) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cdot';
      b.setAttribute('aria-label', `${i + 1} / ${n}`);
      b.addEventListener('click', () => go(i));
      dotsBox.append(b);
      dots.push(b);
    });
  }

  // Clona las diapositivas para que el ciclo sea continuo, sólo si hacen falta.
  const setupLoop = () => {
    const need = n > visible();
    root.classList.toggle('is-static', !need);
    if (need && !looping) {
      clones = slides.map((s) => {
        const c = s.cloneNode(true) as HTMLElement;
        c.setAttribute('aria-hidden', 'true');
        c.inert = true;
        c.classList.add('is-clone');
        track.append(c);
        return c;
      });
      looping = true;
    } else if (!need && looping) {
      clones.forEach((c) => c.remove());
      clones = [];
      looping = false;
      track.scrollLeft = 0;
    }
  };
  // Al pasar al bloque clonado, regresa de forma invisible al original equivalente.
  const normalize = () => {
    if (!looping) return;
    const set = step() * n;
    if (track.scrollLeft >= set - 2) track.scrollLeft -= set;
  };
  const scrollTo = (left: number) => track.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
  const go = (i: number) => scrollTo(i * step());
  const goNext = () => {
    if (!looping && track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) return scrollTo(0);
    scrollTo(track.scrollLeft + step());
  };
  const goPrev = () => {
    if (looping && track.scrollLeft < 2) track.scrollLeft += step() * n;
    scrollTo(track.scrollLeft - step());
  };

  const update = () => {
    const i = index();
    dots.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
    if (counter) counter.textContent = `${i + 1} / ${n}`;
    if (!looping && !interval) {
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }
    // Reinicia la animación de la barra de progreso del punto activo.
    root.style.setProperty('--autoplay', `${interval}ms`);
  };

  let scrollTimer: number | undefined;
  track.addEventListener('scroll', () => {
    requestAnimationFrame(update);
    clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(normalize, 120);
  }, { passive: true });
  if ('onscrollend' in window) track.addEventListener('scrollend', normalize);

  prev?.addEventListener('click', () => { goPrev(); restart(); });
  next?.addEventListener('click', () => { goNext(); restart(); });

  // Avance automático
  let timer: number | undefined;
  let paused = false;
  let onScreen = false;
  const pulse = () => { root.classList.remove('is-ticking'); void root.offsetWidth; root.classList.add('is-ticking'); };
  const tick = () => { if (!paused && onScreen && !document.hidden && !root.classList.contains('is-static')) { goNext(); pulse(); } };
  const restart = () => {
    if (!interval) return;
    clearInterval(timer);
    timer = window.setInterval(tick, interval);
    pulse();
  };
  const setPaused = (v: boolean) => { paused = v; root.classList.toggle('is-paused', v); };
  if (interval) {
    root.addEventListener('pointerenter', () => setPaused(true));
    root.addEventListener('pointerleave', () => { setPaused(false); restart(); });
    root.addEventListener('focusin', () => setPaused(true));
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget as Node)) { setPaused(false); restart(); } });
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) restart(); }, { threshold: 0.35 }).observe(root);
  }

  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { setupLoop(); update(); }, 150); });
  setupLoop();
  update();
});

/* ---------- Contadores ---------- */
const countIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    countIO.unobserve(e.target);
    const el = e.target as HTMLElement;
    const to = Number(el.dataset.countTo);
    if (reduceMotion) { el.textContent = String(to); continue; }
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}, { threshold: 0.6 });
$$('[data-count-to]').forEach((el) => countIO.observe(el));

/* ---------- Video de YouTube en modal (sin cargar YouTube hasta el clic) ---------- */
const videoDlg = document.getElementById('video') as HTMLDialogElement | null;
if (videoDlg) {
  const frameWrap = videoDlg.querySelector<HTMLElement>('[data-frame]')!;
  $$('[data-yt]').forEach((b) =>
    b.addEventListener('click', () => {
      frameWrap.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0" title="${b.getAttribute('aria-label') ?? 'Video'}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      openDialog(videoDlg, b);
    }),
  );
  videoDlg.addEventListener('k:closed', () => (frameWrap.innerHTML = ''));
}

/* ---------- Galería: filtros y visor ---------- */
$$('[data-gallery]').forEach((root) => {
  const items = $$<HTMLElement>('[data-tags]', root);
  $$<HTMLButtonElement>('[data-filter]', root).forEach((btn, _, all) =>
    btn.addEventListener('click', () => {
      all.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.filter!;
      items.forEach((it) => {
        const show = f === 'all' || it.dataset.tags!.split(' ').includes(f);
        it.classList.toggle('is-hidden', !show);
      });
    }),
  );
  const viewer = document.getElementById('lightbox') as HTMLDialogElement | null;
  if (!viewer) return;
  const imgEl = viewer.querySelector<HTMLImageElement>('img')!;
  const cap = viewer.querySelector<HTMLElement>('figcaption')!;
  let current = 0;
  const visible = () => items.filter((i) => !i.classList.contains('is-hidden'));
  const show = (i: number) => {
    const list = visible();
    current = (i + list.length) % list.length;
    const a = list[current].querySelector<HTMLAnchorElement>('a')!;
    imgEl.src = a.href;
    imgEl.alt = a.dataset.alt ?? '';
    cap.textContent = a.dataset.alt ?? '';
  };
  items.forEach((it) =>
    it.querySelector('a')!.addEventListener('click', (e) => {
      e.preventDefault();
      show(visible().indexOf(it));
      openDialog(viewer, it.querySelector('a'));
    }),
  );
  viewer.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(current - 1));
  viewer.querySelector('[data-lb-next]')?.addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
});

/* ---------- Formularios (envío sin recargar) ---------- */
$$<HTMLFormElement>('form[data-ajax-form]').forEach((form) => {
  const msg = form.querySelector<HTMLElement>('[role="status"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
    btn?.setAttribute('disabled', '');
    form.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !json.ok) throw new Error();
      form.reset();
      if (msg) { msg.textContent = form.dataset.success ?? ''; msg.className = msg.className.replace(/\bis-(ok|err)\b/g, '') + ' is-ok'; }
      form.dispatchEvent(new Event('k:sent'));
    } catch {
      if (msg) { msg.textContent = form.dataset.error ?? ''; msg.className = msg.className.replace(/\bis-(ok|err)\b/g, '') + ' is-err'; }
    } finally {
      btn?.removeAttribute('disabled');
      form.removeAttribute('aria-busy');
    }
  });
});
