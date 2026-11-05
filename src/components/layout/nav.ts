import type { Lang, RouteKey } from '@/i18n/routes';
import { routes } from '@/i18n/routes';
import { t } from '@/i18n/ui';

export interface NavItem { label: string; key?: RouteKey; href?: string; children?: { label: string; key: RouteKey; href: string }[] }

export function getNav(lang: Lang): NavItem[] {
  const n = t(lang).nav;
  const link = (key: RouteKey, label: string) => ({ key, label, href: routes[key][lang] });
  return [
    { label: n.about, children: [link('about', n.aboutUs), link('history', n.history), link('model', n.model), link('profile', n.profile)] },
    { label: n.levels, children: [link('kinder', n.kinder), link('primary', n.primary)] },
    link('gallery', n.gallery),
    link('afterSchool', n.afterSchool),
    link('faq', n.faq),
  ];
}
