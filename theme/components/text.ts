import { responsiveProperty } from '~/theme/utils'

export const TextStyling = {
  variants: {
    title: {
      fontWeight: 'black',
      fontSize: responsiveProperty({ mobileSize: 36, desktopSize: 72 }),
      color: 'text.dark',
      lineHeight: 1.2,
    },
    subtitle: {
      fontWeight: 'bold',
      fontSize: responsiveProperty({ mobileSize: 25, desktopSize: 45 }),
      color: 'text.dark',
      position: 'relative',
      lineHeight: 1.2,
      paddingTop: 'calc(0.3em + 5px)',
      _before: {
        top: '5px',
        left: 0,
        content: '""',
        width: '1.7em',
        height: '5px',
        background: 'aqua.light',
        position: 'absolute',
      },
    },
    'subtitle-no-decoration': {
      fontWeight: 'black',
      fontSize: responsiveProperty({ mobileSize: 25, desktopSize: 45 }),
      color: 'text.dark',
      lineHeight: 1.2,
    },
    normal: {
      fontWeight: '400',
      fontSize: responsiveProperty({ mobileSize: 14, desktopSize: 18 }),
      lineHeight: '200%',
      color: 'text.light',
    },
  },
}
export const TextComponent = {
  components: {
    Text: TextStyling,
  },
}
