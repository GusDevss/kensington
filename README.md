# Kensington Academy — sitio web

Sitio estático construido con **[Astro 5](https://astro.build)**, que reemplaza la versión anterior en WordPress.
Genera HTML puro (sin servidor), así que es muy rápido, seguro y fácil de alojar en Hostinger.

## Qué incluye

- **12 páginas en español + inglés** (`/` y `/en/`), con las mismas URLs del WordPress en español para no perder posicionamiento.
- **SEO técnico**: títulos y descripciones por página, `canonical`, `hreflang` ES/EN, Open Graph/Twitter con imagen 1200×630, `sitemap-index.xml`, `robots.txt` y datos estructurados (School, WebSite, BreadcrumbList, FAQPage, Course, ImageGallery).
- **Imágenes optimizadas**: AVIF/WebP responsivas generadas automáticamente, con carga diferida (lazy loading).
- **Tipografías locales** (Outfit + Balsamiq Sans), sin depender de Google Fonts.
- **Íconos** [Lucide](https://lucide.dev) en SVG, elegidos según el contenido de cada sección (sustituyen los íconos genéricos de la plantilla).
- **Componentes conservados del diseño original**: barra superior, menú con submenús, buscador, menú lateral, selector de idioma, acordeones, pestañas, carruseles de grados y principios, rueda interactiva del modelo Altanima, galería con filtros y visor, marquesina, frases destacadas con trazo a mano y footer.
- **Formulario "Agendar visita"** y suscripción: envían correo con `public/api/contacto.php` (PHP nativo de Hostinger), con protección antispam.
- **Accesibilidad**: navegación con teclado, `prefers-reduced-motion`, contraste AA y textos alternativos.
- Textos largos **justificados** con división silábica automática.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/ y release/kensington-hostinger.zip
```

## Publicar en Hostinger

1. Ejecuta `npm run build` (o usa el zip ya generado).
2. En hPanel → **Administrador de archivos** → `public_html`: respalda y elimina los archivos de WordPress.
3. Sube `release/kensington-hostinger.zip` a `public_html` y usa **Extraer**. El `index.html` debe quedar directamente en `public_html`.
4. Verifica que se copió el `.htaccess` (es un archivo oculto): activa HTTPS, caché, compresión y la página 404.
5. (Recomendado) Crea el buzón `no-reply@kacademy.com.mx` en hPanel → Correos para que los formularios lleguen sin caer en spam.
6. Da de alta `https://kacademy.com.mx/sitemap-index.xml` en Google Search Console.

> Si el dominio final no es `kacademy.com.mx`, cámbialo en `astro.config.mjs` (`SITE_URL`), `public/robots.txt` y `public/api/contacto.php` (`FROM_EMAIL`).

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Teléfono, correo, dirección, redes, videos | `src/config/site.ts` |
| Textos de cada página (ES y EN) | `src/data/*.ts` |
| Textos de menú y botones | `src/i18n/ui.ts` |
| URLs por idioma | `src/i18n/routes.ts` |
| Imágenes | `src/assets/img/` (reemplaza el archivo conservando el nombre) |
| Colores, tipografía, espaciados | `src/styles/global.css` (variables en `:root`) |
| Destinatario de formularios | `public/api/contacto.php` |

## Pendientes de contenido

- **Fotografías de alumnos**: el cliente pidió que todos los niños sean güeros. Hay que sustituir con las fotos finales `nino-kinder.webp`, `nino-kinder-alto.webp` y `nina-primaria.webp` (recortes PNG/WebP con fondo transparente, vertical, ≥ 800 px de ancho), además de las fotos de After School si se cambian. Basta con reemplazar los archivos en `src/assets/img/` con el mismo nombre y volver a compilar.
- **Aviso de privacidad integral**: el texto original dice "consulte:" sin enlace. Agregar la URL o el PDF cuando esté disponible.
- **Perfil de egreso**: "Personas agradecidas, conscientes y comprometidas con el bien común" repite el texto de "Constructores de comunidad y paz". Confirmar el texto con el cliente.
- La galería muestra los renders actuales. Al tener fotos reales, agrégalas en `src/views/GalleryView.astro`.
