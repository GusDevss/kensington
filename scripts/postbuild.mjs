// Empaqueta dist/ en release/kensington-hostinger.zip listo para subir a public_html.
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';

const out = 'release/kensington-hostinger.zip';
mkdirSync('release', { recursive: true });
if (existsSync(out)) rmSync(out);
try {
  execSync(`cd dist && zip -qr9 ../${out} . -x '*.DS_Store'`, { stdio: 'inherit' });
  console.log(`\n✔ Paquete listo: ${out}`);
} catch {
  console.warn('⚠ No se pudo crear el zip (¿falta el comando "zip"?). Sube el contenido de dist/ manualmente.');
}
