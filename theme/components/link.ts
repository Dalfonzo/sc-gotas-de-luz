import { responsiveProperty } from '~/theme/utils'

const commonBtnLinkStyles = {
  fontWeight: 'bold',
  paddingTop: responsiveProperty({ mobileSize: 1, desktopSize: 1, unit: 'rem' }),
  paddingBottom: responsiveProperty({ mobileSize: 1, desktopSize: 1, unit: 'rem' }),
  paddingLeft: responsiveProperty({ mobileSize: 1.5, desktopSize: 2, unit: 'rem' }),
  paddingRight: responsiveProperty({ mobileSize: 1.5, desktopSize: 2, unit: 'rem' }),
  fontSize: responsiveProperty({ mobileSize: 14, desktopSize: 18, unit: 'px' }),
  display: 'inline-block',
  borderRadius: '5px',
}

const commonIconBtnLinkStyles = {
  '& > svg': {
    mx: '0.3em',
    fontSize: '1.4em',
    fill: 'currentColor',
  },
  _hover: {
    transform: 'scale(1.03)',
  },
  _active: {
    transform: 'scale(1.00) translateY(0.1em)',
  },
}

export const linkStyles = {
  components: {
    Link: {
      decoration: 'none',
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        'lnk-btn-primary': {
          ...commonBtnLinkStyles,
          background: 'aqua.light',
          color: 'white',
          ...commonIconBtnLinkStyles,
        },
        'lnk-btn-white': {
          ...commonBtnLinkStyles,
          background: 'white',
          ...commonIconBtnLinkStyles,
          color: 'text.dark',
        },
        'lnk-btn-black': {
          ...commonBtnLinkStyles,
          background: 'text.dark',
          ...commonIconBtnLinkStyles,
          color: 'white',
        },
      },
    },
  },
}
