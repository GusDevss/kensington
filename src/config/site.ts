/** Datos de contacto y redes. Editar aquí actualiza todo el sitio. */
export const site = {
  name: 'Kensington Academy',
  legalName: 'K Academy Sociedad Civil',
  phone: '442 434 7600',
  phoneHref: 'tel:+524424347600',
  /** Botón flotante de WhatsApp (número con lada de país, sin espacios) */
  whatsapp: '524424347600',
  email: 'kensingtonescucha@gmail.com',
  privacyEmail: 'keyacademy25@gmail.com',
  address: {
    short: 'Av. Tlacote, Km 2.7, Corregidora, Qro.',
    street: 'Carretera Estatal No. 11, Querétaro-Tlacote, km 2+380, Ex-hacienda San Juanico',
    locality: 'Corregidora',
    region: 'Querétaro',
    country: 'MX',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Carretera+Estatal+11+Quer%C3%A9taro-Tlacote+km+2%2B380+Ex-hacienda+San+Juanico+Corregidora+Quer%C3%A9taro',
  social: {
    facebook: 'https://www.facebook.com/people/Kensington-Academy-Quer%C3%A9taro/61580579427033/',
    instagram: 'https://www.instagram.com/k.academy.qro',
    tiktok: 'https://www.tiktok.com/@k.academy.qro',
    youtube: 'https://www.youtube.com/@KensingtonAcademyqro',
    x: 'https://x.com/keyacademy26',
    spotify: 'https://open.spotify.com/show/33g4geisTAaoxuVzuiEJPd?si=440d160790b34479',
  },
  videos: {
    home: '7WAI68p_PZ0',
    primary: '7WAI68p_PZ0',
    /** Enlace del componente "Descubre la educación del futuro" */
    featuredUrl: 'https://youtu.be/7WAI68p_PZ0?si=9v-Dp2KlWnhSgV_A',
  },
  /** Endpoint PHP (Hostinger) que recibe los formularios. */
  formEndpoint: '/api/contacto.php',
} as const;

export type SocialKey = keyof typeof site.social;
