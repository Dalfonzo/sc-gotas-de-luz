import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { BsArrowDownCircleFill } from 'react-icons/bs'
import { responsiveProperty } from '~/theme/utils'

const Hero = () => {
  return (
    <Flex as="section" flexDir="column" alignItems="center" justifyContent="center" height="90vh">
      <Box marginTop={responsiveProperty({ mobileSize: 3, desktopSize: 5, unit: 'rem' })}>
        <Text variant="title" textAlign="center" margin="auto" color="aqua.light">
          Iluminando
        </Text>
        <Text variant="title" textAlign="center" margin="auto">
          <Text variant="title" textAlign="center" margin="auto" color="aqua.light" as="span" marginRight="0.3em">
            momentos
          </Text>
          para
        </Text>
        <Text
          variant="title"
          marginBottom={responsiveProperty({ mobileSize: 0.5, desktopSize: 2, unit: 'rem' })}
          textAlign={{ base: 'center', sm: 'unset' }}
          marginLeft="0.2em"
        >
          generar vida
        </Text>
      </Box>
      <motion.div
        transition={{ ease: 'linear', duration: 1.5, repeat: Infinity }}
        animate={{ y: [-10, -5, 0, 5, -5, -10] }}
      >
        <Icon
          as={BsArrowDownCircleFill}
          fontSize={responsiveProperty({ mobileSize: 2, desktopSize: 4, unit: 'rem' })}
          marginTop={responsiveProperty({ mobileSize: 5, desktopSize: 10, unit: 'rem' })}
          color="text.dark"
        />
      </motion.div>
    </Flex>
  )
}

export default Hero
