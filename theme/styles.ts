export const globalStyles = {
  colors: {
    yellow: '#FFF06F',
    aqua: { light: '#60E0E3', dark: '#519193' },
    text: { light: '#616161', dark: '#202525' },
    pastel: { blue: '#DDFEFF', yellow: '#F9FFE9', green: '#E9FFEC' },
  },
  styles: {
    global: {
      '*': {
        boxSizing: 'border-box',
      },
      body: {
        padding: '0',
        margin: '0',
        fontFamily: 'inter, sans-serif',
        color: 'text.light',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  },
}
