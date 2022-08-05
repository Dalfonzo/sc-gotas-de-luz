const commonBtnLinkStyles = {
  fontWeight: 'bold',
  padding: '1rem 2rem',
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
      },
    },
  },
}
