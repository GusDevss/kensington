/**
 * Traducción automática (idiomas distintos de ES/EN) con Google Translate.
 * Funciona como el plugin GTranslate: guarda el idioma en la cookie "googtrans"
 * y sólo descarga el script de Google cuando el visitante eligió otro idioma.
 */
const COOKIE = 'googtrans';
const pageLang = document.documentElement.lang.startsWith('en') ? 'en' : 'es';

const getTarget = (): string | null => {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  const target = m ? decodeURIComponent(m[1]) : null;
  return target && target !== pageLang ? target : null;
};
const domains = () => {
  const host = location.hostname;
  const parts = host.split('.');
  const list = ['', host];
  if (parts.length > 2) list.push('.' + parts.slice(-2).join('.'), '.' + parts.slice(-3).join('.'));
  else list.push('.' + host);
  return list;
};
const setCookie = (value: string | null) => {
  for (const d of domains()) {
    const domain = d ? `; domain=${d}` : '';
    document.cookie = value
      ? `${COOKIE}=${value}; path=/${domain}; max-age=31536000; SameSite=Lax`
      : `${COOKIE}=; path=/${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

function loadGoogle() {
  const holder = document.createElement('div');
  holder.id = 'gt-element';
  holder.hidden = true;
  document.body.append(holder);
  (window as any).kGTInit = () => {
    new (window as any).google.translate.TranslateElement({ pageLanguage: pageLang, autoDisplay: false }, 'gt-element');
  };
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=kGTInit';
  s.async = true;
  document.head.append(s);
}

const target = getTarget();
if (target) {
  document.documentElement.classList.add('is-translated');
  loadGoogle();
}

document.querySelectorAll<HTMLElement>('[data-lang-switch]').forEach((root) => {
  const current = root.querySelector<HTMLElement>('[data-lang-current]');
  const nativeLinks = root.querySelectorAll<HTMLAnchorElement>('[data-lang-native]');
  const autoBtns = root.querySelectorAll<HTMLButtonElement>('[data-gt]');

  // Marca el idioma activo cuando hay traducción automática.
  if (target && current) {
    const btn = root.querySelector<HTMLButtonElement>(`[data-gt="${target}"]`);
    if (btn) {
      nativeLinks.forEach((a) => a.removeAttribute('aria-current'));
      btn.setAttribute('aria-current', 'true');
      current.innerHTML = '';
      current.append(btn.querySelector('.flag')!.cloneNode(true));
      const span = document.createElement('span');
      span.textContent = btn.dataset.short ?? target.toUpperCase();
      current.append(span);
    }
  }

  autoBtns.forEach((b) =>
    b.addEventListener('click', () => {
      setCookie(`/${pageLang}/${b.dataset.gt}`);
      location.reload();
    }),
  );
  nativeLinks.forEach((a) =>
    a.addEventListener('click', (e) => {
      if (!getTarget()) return;
      e.preventDefault();
      setCookie(null);
      location.href = a.href;
    }),
  );
});
