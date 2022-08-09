/* eslint-disable max-len */
const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-50%)',
}

const floatingBaseConfiguration = {
  container: {
    _focusWithin: {
      label: {
        ...activeLabelStyles,
      },
      input: {
        borderColor: 'aqua.light',
        boxShadow: '0 0 0 1px #60E0E3',
      },
    },
    'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) + label':
      {
        ...activeLabelStyles,
      },

    'input[aria-invalid=true], input[data-invalid]': {
      borderColor: 'red',
      _focus: {
        boxShadow: '0 0 0 1px red',
      },
    },
    'input[data-invalid] + label, input[aria-invalid=true] + label': {
      color: 'red',
    },
    label: {
      top: 0,
      left: 0,
      transform: 'translateY(0.6em)',
      position: 'absolute',
      backgroundColor: 'white',
      pointerEvents: 'none',
      mx: 3,
      px: 1,
      transformOrigin: 'left top',
      zIndex: 1,
      fontSize: '18px',
      color: 'text.light',
    },
    input: {
      fontSize: '18px',
      padding: '1.5rem 1rem',
      color: 'text.light',
    },
  },
}

export const Form = {
  components: {
    Form: {
      variants: {
        floating: {
          ...floatingBaseConfiguration,
        },
      },
    },
  },
}
