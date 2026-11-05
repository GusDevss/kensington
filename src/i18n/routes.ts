export const locales = ['es', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'es';

/** Cada página tiene una clave y su ruta por idioma (las rutas en español conservan las URLs del sitio WordPress). */
export const routes = {
  home: { es: '/', en: '/en/' },
  about: { es: '/nosotros/', en: '/en/about-us/' },
  history: { es: '/historia/', en: '/en/our-story/' },
  model: { es: '/modelo-educativo/', en: '/en/educational-model/' },
  profile: { es: '/perfil-de-egreso/', en: '/en/graduate-profile/' },
  kinder: { es: '/kinder/', en: '/en/kindergarten/' },
  primary: { es: '/primaria/', en: '/en/elementary/' },
  gallery: { es: '/galeria/', en: '/en/gallery/' },
  afterSchool: { es: '/after-school/', en: '/en/after-school/' },
  faq: { es: '/preguntas-frecuentes/', en: '/en/faq/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/aviso-de-privacidad/', en: '/en/privacy-notice/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

export const path = (key: RouteKey, lang: Lang) => routes[key][lang];

export const htmlLang: Record<Lang, string> = { es: 'es-MX', en: 'en' };
export const ogLocale: Record<Lang, string> = { es: 'es_MX', en: 'en_US' };
