import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type IconNode = [string, Record<string, string>][];
const cache = new Map<string, IconNode>();
const dir = join(process.cwd(), 'node_modules/@lucide/astro/src/icons');

/** Lee los datos del ícono desde @lucide/astro (sólo en build; no se envía JS al navegador). */
export function getIconNode(name: string): IconNode {
  const hit = cache.get(name);
  if (hit) return hit;
  let src: string;
  try {
    src = readFileSync(join(dir, `${name}.ts`), 'utf8');
  } catch {
    throw new Error(`[Icon] El ícono "${name}" no existe en Lucide`);
  }
  const m = src.match(/const iconData: LucideIconData = (\{.*\});/);
  if (!m) throw new Error(`[Icon] No se pudo leer "${name}"`);
  const node = JSON.parse(m[1]).node as IconNode;
  cache.set(name, node);
  return node;
}
