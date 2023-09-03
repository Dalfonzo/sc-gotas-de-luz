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
import Link from 'next/link'
import { useEffect } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import LinkButton from '../../common/link-button'
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
      <Box
        maxW="5xl"
        margin="auto"
        display="flex"
        justifyContent={{ base: 'flex-start', md: 'space-between' }}
        alignItems="center"
        padding="16px"
      >
        <Link href="/">
          <Image cursor="pointer" src="/assets/svg/logo-footer-black.svg" alt="Logo de gotas de luz" width="60px" />
        </Link>
        <NavLinks display={{ base: 'none', lg: 'unset' }} />
        <LinkButton
          href="/donate"
          variant="lnk-btn-light-blue"
          content="Donar"
          position="relative"
          display="block"
          width="fit-content"
          withArrow={false}
          marginLeft={{ base: 'auto', lg: 'unset' }}
          marginRight={{ base: '1rem', lg: 'unset' }}
        />
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
