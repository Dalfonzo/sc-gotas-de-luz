import { Image } from '@chakra-ui/react'
import { Container, Title } from '@mantine/core'

export default function AuthLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Container w="100%" h="100vh" fluid bg="gray.1">
      <Container size={420} py={40}>
        <Image src="/assets/svg/gotas_de_luz.svg" alt="asd" width={75} height={75} mx="auto" mt="4" mb="5" />
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          color="dark"
        >
          {title}
        </Title>
        {children}
      </Container>
    </Container>
  )
}
