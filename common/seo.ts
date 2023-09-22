const COMMON = {
  title: 'Gotas de Luz - Iluminando momentos para generar vida',
  divider: ' | ',
  description: 'Bievenidos a la página oficial de Gotas de Luz.',
}

export const META = {
  home: {
    title: 'Inicio' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  signIn: {
    title: 'Iniciar sesión' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  forgotPassword: {
    title: 'Olvidé contraseña' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  volunteers: {
    title: 'Voluntariado' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  events: {
    title: 'Eventos' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  donate: {
    title: 'Donaciones' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  about: {
    title: 'Acerca' + COMMON.divider + COMMON.title,
    description: COMMON.description,
  },
  admin: (pageTitle: string) => ({
    title: pageTitle + COMMON.divider + COMMON.title,
    description: COMMON.description,
  }),
  openGraph: {
    type: 'website',
    title: 'Gotas de Luz',
    description: COMMON.description,
    url: 'https://www.fundaciongotasdeluz.org/',
    siteName: 'Gotas de Luz',
    images: [
      {
        url: 'https://www.fundaciongotasdeluz.org/assets/svg/gotas_de_luz.svg',
        width: 800,
        height: 600,
        alt: 'Logo de gotas de luz',
        type: 'image/jpeg',
      },
    ],
  },
}
