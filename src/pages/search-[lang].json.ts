import type { APIRoute, GetStaticPaths } from 'astro';
import { routes, type Lang, type RouteKey } from '@/i18n/routes';
import { t } from '@/i18n/ui';
import home from '@/data/home';
import about from '@/data/about';
import history from '@/data/history';
import model from '@/data/model';
import profile from '@/data/profile';
import kinder from '@/data/kinder';
import primary from '@/data/primary';
import afterSchool from '@/data/afterSchool';
import faq from '@/data/faq';

/** Índice de búsqueda generado en build a partir del contenido de cada página. */
const sources: Partial<Record<RouteKey, Record<Lang, any>>> = { home, about, history, model, profile, kinder, primary, afterSchool, faq };

const collect = (v: unknown, out: string[] = []): string[] => {
  if (typeof v === 'string') { if (v.length > 2 && !/^[a-z0-9-]+$/.test(v)) out.push(v.replaceAll('**', '')); }
  else if (Array.isArray(v)) v.forEach((x) => collect(x, out));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => k !== 'meta' && k !== 'icon' && collect(x, out));
  return out;
};

export const getStaticPaths = (() => [{ params: { lang: 'es' } }, { params: { lang: 'en' } }]) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const lang = params.lang as Lang;
  const nav = t(lang).nav;
  const entries = (Object.keys(sources) as RouteKey[]).map((key) => {
    const d = sources[key]![lang];
    return { t: d.meta.title.split(' | ')[0], u: routes[key][lang], d: d.meta.description, x: collect(d).join(' · ') };
  });
  const extra: [RouteKey, string, string][] = lang === 'es'
    ? [['gallery', 'Galería', 'Instalaciones, aulas de Kinder y Primaria, patios y áreas verdes.'], ['contact', 'Agendar visita / Contacto', 'Agenda una visita, admisiones, teléfono, correo y dirección.'], ['privacy', nav.privacy, 'Datos personales, derechos ARCO, K Academy Sociedad Civil.']]
    : [['gallery', 'Gallery', 'Facilities, Kindergarten and Elementary classrooms, courtyards and green areas.'], ['contact', 'Book a visit / Contact', 'Book a visit, admissions, phone, email and address.'], ['privacy', nav.privacy, 'Personal data, ARCO rights, K Academy Sociedad Civil.']];
  extra.forEach(([key, title, desc]) => entries.push({ t: title, u: routes[key][lang], d: desc, x: desc }));
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
