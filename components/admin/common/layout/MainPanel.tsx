import { Box, HTMLChakraProps, ThemingProps, useStyleConfig } from '@chakra-ui/react'

function MainPanel(props: HTMLChakraProps<any> & ThemingProps) {
  const { variant, children, ...rest } = props
  const styles = useStyleConfig('MainPanel', { variant })
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  )
}

export default MainPanel
