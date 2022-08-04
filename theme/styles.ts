export const globalStyles = {
  colors: {
    yellow: '#FFF06F',
    aqua: { light: '#60E0E3', dark: '#64A6A5' },
    text: { light: '#616161', dark: '#202525' },
  },
  styles: {
    global: {
      '*': {
        boxSizing: 'border-box',
        fontFamily: 'inter',
      },
      body: {
        padding: '0',
        margin: '0',
        fontFamily: 'inter, sans-serif',
        color: 'text.dark',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  },
}
