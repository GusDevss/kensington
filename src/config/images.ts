/**
 * Catálogo central de imágenes.
 * Para cambiar una foto basta con reemplazar el archivo en src/assets/img conservando el nombre
 * (Astro genera automáticamente versiones AVIF/WebP en varios tamaños).
 *
 * ⚠️ Fotos de niños marcadas con `replace: true`: pendientes de sustituir por las fotografías finales
 *    solicitadas por el cliente.
 */
import fachadaPrincipal from '@/assets/img/fachada-principal.webp';
import patioCentral from '@/assets/img/patio-central.webp';
import fachadaLateral from '@/assets/img/fachada-lateral.webp';
import patioVentanales from '@/assets/img/patio-ventanales.webp';
import aulaPrimaria from '@/assets/img/aula-primaria.webp';
import jardinJuegos from '@/assets/img/jardin-juegos.webp';
import aulaKinder from '@/assets/img/aula-kinder.webp';
import ninoKinder from '@/assets/img/nino-kinder.webp';
import ninoKinderAlto from '@/assets/img/nino-kinder-alto.webp';
import ninaPrimaria from '@/assets/img/nina-primaria.webp';
import ninoDibujando from '@/assets/img/nino-dibujando.jpg';
import asFutbol from '@/assets/img/after-school-futbol.webp';
import asMusica from '@/assets/img/after-school-musica.webp';
import asRobotica from '@/assets/img/after-school-robotica.webp';
import asTaekwondo from '@/assets/img/after-school-taekwondo.jpg';
import comedor from '@/assets/img/comedor.webp';
import maestra from '@/assets/img/maestra.webp';
import adnAltanima from '@/assets/img/adn-altanima.webp';
import canalYoutube from '@/assets/img/canal-youtube.avif';
import canalEmocional from '@/assets/img/canal-educacion-emocional.avif';
import altanimaLogo from '@/assets/img/altanima-logo.png';

export const img = {
  fachadaPrincipal,
  patioCentral,
  fachadaLateral,
  patioVentanales,
  aulaPrimaria,
  jardinJuegos,
  aulaKinder,
  ninoKinder,
  ninoKinderAlto,
  ninaPrimaria,
  ninoDibujando,
  asFutbol,
  asMusica,
  asRobotica,
  asTaekwondo,
  comedor,
  maestra,
  adnAltanima,
  canalYoutube,
  canalEmocional,
  altanimaLogo,
};

export type ImgKey = keyof typeof img;
