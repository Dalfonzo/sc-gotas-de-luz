import {
  Box,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import NavLinks from './NavLinks'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth > 990 && isOpen) {
        onClose()
      }
    }

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [isOpen, onClose])

  return (
    <Box as="header">
      <Box maxW="7xl" margin="auto" display="flex" justifyContent="space-between" alignItems="center" padding="16px">
        <Image src="/assets/svg/logo-header.svg" alt="Logo de gotas de luz" />
        <NavLinks display={{ base: 'none', lg: 'unset' }} />
        <Icon
          as={BiMenuAltRight}
          onClick={onOpen}
          fontSize="2.5em"
          color="text.dark"
          display={{ base: 'unset', lg: 'none' }}
          role="button"
        />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginBottom="2.5rem" />
          <ModalCloseButton />
          <ModalBody>
            <NavLinks />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Header
