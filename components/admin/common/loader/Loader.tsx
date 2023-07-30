import { Box, Loader, Stack, Text } from '@mantine/core'
// TODO: Replace this with useUiLoader de luis
const CustomLoader = () => {
  return (
    <Box mih="350px" h="75vh" display="flex">
      <Stack m="auto">
        <Loader mx="auto" />
        <Text size="sm" color="dimmed" mx="auto">
          Cargando...
        </Text>
      </Stack>
    </Box>
  )
}

export default CustomLoader
