import { As, Card, CardBody, CardHeader, Divider, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { ThemeIcon } from '@mantine/core'
import { ReactNode } from 'react'

export interface InfoCardProps {
  title: string
  content: string | ReactNode
  icon: As
}
export const InfoCard = ({ title, content, icon }: InfoCardProps) => {
  return (
    <Card size="md" variant="filled" borderRadius="lg" maxW="sm" align="center" background="#fbfbfb" padding={4}>
      <CardHeader>
        <Flex direction="column" align="center" gap={3}>
          <ThemeIcon color="cyan.4" radius="xl" size={50} variant="light">
            <Icon as={icon} boxSize={6} />
          </ThemeIcon>
          <Heading size="md">{title}</Heading>
        </Flex>
      </CardHeader>
      <CardBody px="6">
        <Divider mb="6" mt="2" />
        <Text textAlign="justify">{content}</Text>
      </CardBody>
    </Card>
  )
}
