import {
  Box,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useWindowScroll } from '@mantine/hooks'
import Link from 'next/link'
import { useEffect } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import LinkButton from '../../common/link-button'
import NavLinks from './NavLinks'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [scroll, scrollTo] = useWindowScroll()
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth > 990 && isOpen) {
        onClose()
      }
    }

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [isOpen, onClose])

  const isScrolledDown = scroll.y > 0

  return (
    <Box
      as="header"
      boxShadow={isScrolledDown ? 'md' : 'none'}
      position="sticky"
      top="0"
      left="0"
      background="white"
      zIndex={10}
    >
      <Box
        maxW="5xl"
        margin="auto"
        display="flex"
        justifyContent={{ base: 'flex-start', md: 'space-between' }}
        alignItems="center"
        transition="padding ease 0.5s"
        padding={isScrolledDown ? '12px' : '16px'}
      >
        <Link href="/">
          <Image
            cursor="pointer"
            src="/assets/svg/logo-footer-black.svg"
            alt="Logo de gotas de luz"
            width={isScrolledDown ? '40px' : '60px'}
            transition="width ease 0.5s"
          />
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
        <IconButton
          aria-label="menu"
          display={{ base: 'unset', lg: 'none' }}
          icon={<Icon as={BiMenuAltRight} onClick={onOpen} fontSize="2.5em" color="aqua.dark" role="button" />}
          background="white"
          borderRadius="50%"
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
