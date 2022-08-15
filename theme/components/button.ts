import { responsiveProperty } from '../utils'

const commonBtnStyles = {
  fontWeight: 'bold',
  paddingTop: responsiveProperty({ mobileSize: 0.5, desktopSize: 1, unit: 'rem' }),
  paddingBottom: responsiveProperty({ mobileSize: 0.5, desktopSize: 1, unit: 'rem' }),
  paddingLeft: responsiveProperty({ mobileSize: 0.5, desktopSize: 2, unit: 'rem' }),
  paddingRight: responsiveProperty({ mobileSize: 0.5, desktopSize: 2, unit: 'rem' }),
  fontSize: responsiveProperty({ mobileSize: 12, desktopSize: 18, unit: 'px' }),
  display: 'inline-block',
  borderRadius: '5px',
  height: 'unset',
  width: 'fit-content',
  _focus: {
    boxShadow: 'none',
  },
  _hover: {
    boxShadow: 'none',
    cursor: 'pointer',
  },
}

const commonIconBtnStyles = {
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

export const buttonStyles = {
  components: {
    Button: {
      variants: {
        'no-hover': {
          _hover: {
            boxShadow: 'none',
          },
        },
        'transparent-with-icon': {
          bg: 'transparent',
          fontWeight: 'bold',
          borderRadius: 'inherit',
          cursor: 'pointer',
          _active: {
            bg: 'transparent',
            transform: 'none',
            borderColor: 'transparent',
          },
          _focus: {
            boxShadow: 'none',
          },
          _hover: {
            boxShadow: 'none',
          },
        },
        'btn-primary': {
          ...commonBtnStyles,
          background: 'aqua.light',
          color: 'white',
          ...commonIconBtnStyles,
        },
        'btn-white': {
          ...commonBtnStyles,
          background: 'white',
          ...commonIconBtnStyles,
          color: 'text.dark',
        },
        'btn-white-border': {
          ...commonBtnStyles,
          ...commonIconBtnStyles,
          background: 'white',
          border: '1px solid',
          borderColor: 'aqua.light',
          color: 'aqua.light',
        },
      },
      baseStyle: {
        borderRadius: '15px',
        _focus: {
          boxShadow: 'none',
        },
      },
    },
  },
}
