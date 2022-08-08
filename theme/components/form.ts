/* eslint-disable max-len */
const activeLabelStyles = {
  // top: 0,
  transform: 'scale(0.85) translateY(-160%)',
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
    'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label': {
      ...activeLabelStyles,
    },
    'input[aria-invalid=true], input[data-invalid]': {
      borderColor: 'red',
    },
    'input[data-invalid] + label, input[aria-invalid=true] + label': {
      color: 'red',
    },
    label: {
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
      position: 'absolute',
      backgroundColor: 'white',
      pointerEvents: 'none',
      mx: 3,
      px: 1,
      transformOrigin: 'left top',
      zIndex: 1,
      fontSize: '18px',
    },
    input: {
      fontSize: '18px',
      padding: '1.5rem 1rem',
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
