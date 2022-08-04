import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
        @font-face {
          font-family: 'inter';
          src: url('assets/fonts/inter-Bold.ttf') format('truetype');
          font-weight: bold;
          font-display: swap;
      };
      @font-face {
        font-family: 'inter';
        src: url('assets/fonts/inter-Regular.ttf') format('truetype');
        font-weight: 400;
        font-display: swap;
    };
`}
  />
)

export default Fonts
