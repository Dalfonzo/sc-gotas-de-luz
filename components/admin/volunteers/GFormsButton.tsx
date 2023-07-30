import { Button } from '@mantine/core'
import { IconBrandGoogle } from '@tabler/icons-react'
import Link from 'next/link'
interface Props {
  response?: string
}
export const GFormsButton = ({ response }: Props) => {
  const getLink = () =>
    `https://docs.google.com/forms/d/${process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEERS_ID}/edit${
      response ? `#response=${response}` : ''
    }`
  return (
    <Link href={getLink()} target="_blank">
      <Button variant="light" leftIcon={<IconBrandGoogle />}>
        Ver en Formularios
      </Button>
    </Link>
  )
}
