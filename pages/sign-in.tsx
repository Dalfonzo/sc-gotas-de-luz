import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, useColorModeValue } from '@chakra-ui/react'
import Auth from 'layouts/Auth'
import { signIn, useSession } from 'next-auth/react'
import { FormEventHandler, useState } from 'react'

function SignIn() {
  const titleColor = useColorModeValue('teal.300', 'teal.200')
  const textColor = useColorModeValue('gray.400', 'white')
  const [userInfo, setUserInfo] = useState({ email: '', password: '' })
  const session = useSession()
  console.log({ session })
  const handleSubmit: FormEventHandler<HTMLDivElement> = async (e) => {
    // validate your userinfo
    e.preventDefault()
    console.log(userInfo)
    const res = await signIn('credentials', {
      email: userInfo.email,
      password: userInfo.password,
      redirect: true,
      callbackUrl: '/admin/dashboard',
    })

    console.log(res)
  }

  return (
    <Auth>
      <Flex position="relative" mb="40px">
        <Flex
          h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
          w="100%"
          maxW="1044px"
          mx="auto"
          justifyContent="space-between"
          mb="30px"
          pt={{ sm: '50px', md: '0px' }}
        >
          <Flex
            alignItems="center"
            justifyContent="start"
            style={{ userSelect: 'none' }}
            w={{ base: '100%', md: '50%', lg: '42%' }}
          >
            <Flex direction="column" w="100%" background="transparent" p="48px" mt={{ md: '150px', lg: '80px' }}>
              <Heading color={titleColor} fontSize="32px" mb="10px">
                Bienvenido
              </Heading>
              <Text mb="36px" ms="4px" color={textColor} fontWeight="bold" fontSize="14px">
                Introduce tu correo y contraseña para continuar
              </Text>
              <FormControl onSubmit={handleSubmit} as="form">
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Email
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="text"
                  placeholder="Tu dirección de correo"
                  size="lg"
                  value={userInfo.email}
                  onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Contraseña
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="36px"
                  fontSize="sm"
                  type="password"
                  placeholder="Tu contraseña"
                  size="lg"
                  value={userInfo.password}
                  onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                />
                <Button
                  fontSize="1rem"
                  type="submit"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: 'teal.200',
                  }}
                  _active={{
                    bg: 'teal.400',
                  }}
                >
                  Ingresar
                </Button>
              </FormControl>
            </Flex>
          </Flex>
          <Box
            display={{ base: 'none', md: 'block' }}
            overflowX="hidden"
            h="100%"
            w="40vw"
            position="absolute"
            right="0px"
          >
            <Box
              bgImage="url('/assets/img/signInImage.png')"
              w="100%"
              h="100%"
              bgSize="cover"
              bgPosition="50%"
              position="absolute"
              borderBottomLeftRadius="20px"
            ></Box>
          </Box>
        </Flex>
      </Flex>
    </Auth>
  )
}

export default SignIn
