const Text = {
  variants: {
    title: {
      fontWeight: 'bold',
      fontSize: '72px',
      color: 'text.dark',
      lineHeight: 1.2,
    },
    subtitle: {
      fontWeight: 'bold',
      fontSize: '45px',
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
      fontWeight: 'bold',
      fontSize: '45px',
      color: 'text.dark',
      lineHeight: 1.2,
    },
    normal: {
      fontWeight: '400',
      fontSize: '18px',
      lineHeight: '1.5',
      color: 'text.light',
    },
  },
}
export const TextComponent = {
  components: {
    Text,
  },
}
