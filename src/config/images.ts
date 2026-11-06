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
import aulaKinderInterior from '@/assets/img/aula-kinder-interior.webp';
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

// Renders del proyecto (renders/) y del campus (campus/)
import aereaCampus1 from '@/assets/img/renders/render-2.webp';
import aereaCampus2 from '@/assets/img/renders/render-3.webp';
import aereaJardines from '@/assets/img/renders/render-4.webp';
import fachadaMuro from '@/assets/img/renders/render-5.webp';
import accesoFuente from '@/assets/img/renders/render-6.webp';
import patioPrimaria from '@/assets/img/renders/render-7.webp';
import kinderExterior from '@/assets/img/renders/render-8.webp';
import kinderJuegos from '@/assets/img/renders/render-9.webp';
import kinderPatio from '@/assets/img/renders/render-11.webp';
import primariaJuegos from '@/assets/img/renders/render-12.webp';
import primariaCancha from '@/assets/img/renders/render-13.webp';
import canchaTechada from '@/assets/img/renders/render-14.webp';
import comedorExterior from '@/assets/img/renders/render-15.webp';
import campus1 from '@/assets/img/campus/campus-1.webp';
import campus2 from '@/assets/img/campus/campus-2.webp';
import campus3 from '@/assets/img/campus/campus-3.webp';
import campus4 from '@/assets/img/campus/campus-4.webp';
import campus5 from '@/assets/img/campus/campus-5.webp';
import campus6 from '@/assets/img/campus/campus-6.webp';
import campus7 from '@/assets/img/campus/campus-7.webp';
import campus8 from '@/assets/img/campus/campus-8.webp';
import campus9 from '@/assets/img/campus/campus-9.webp';
import campus10 from '@/assets/img/campus/campus-10.webp';
import campus11 from '@/assets/img/campus/campus-11.webp';
import campus12 from '@/assets/img/campus/campus-12.webp';
import campus13 from '@/assets/img/campus/campus-13.webp';
import campus14 from '@/assets/img/campus/campus-14.webp';
import campus15 from '@/assets/img/campus/campus-15.webp';
import campus16 from '@/assets/img/campus/campus-16.webp';
import campus17 from '@/assets/img/campus/campus-17.webp';
import campus18 from '@/assets/img/campus/campus-18.webp';
import campus19 from '@/assets/img/campus/campus-19.webp';
import campus20 from '@/assets/img/campus/campus-20.webp';

export const img = {
  aereaCampus1,
  aereaCampus2,
  aereaJardines,
  fachadaMuro,
  accesoFuente,
  patioPrimaria,
  kinderExterior,
  kinderJuegos,
  kinderPatio,
  primariaJuegos,
  primariaCancha,
  canchaTechada,
  comedorExterior,
  campus1,
  campus2,
  campus3,
  campus4,
  campus5,
  campus6,
  campus7,
  campus8,
  campus9,
  campus10,
  campus11,
  campus12,
  campus13,
  campus14,
  campus15,
  campus16,
  campus17,
  campus18,
  campus19,
  campus20,
  // Portada: tres alumnos (rubio, castaño y apiñonado). Por ahora es la misma foto triplicada.
  heroKid1: ninaPrimaria,
  heroKid2: ninaPrimaria,
  heroKid3: ninaPrimaria,
  fachadaPrincipal,
  patioCentral,
  fachadaLateral,
  patioVentanales,
  aulaPrimaria,
  jardinJuegos,
  aulaKinder,
  aulaKinderInterior,
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
