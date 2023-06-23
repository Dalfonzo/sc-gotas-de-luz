import { As, Card, CardBody, CardHeader, Divider, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

export interface InfoCardProps {
  title: string
  content: string | ReactNode
  icon: As
}
export const InfoCard = ({ title, content, icon }: InfoCardProps) => {
  return (
    <Card size="md" variant="outline" borderRadius="lg" maxW="sm" align="center">
      <CardHeader>
        <Flex direction="column" align="center" gap={3}>
          <Icon as={icon} color="aqua" boxSize="8" />
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
