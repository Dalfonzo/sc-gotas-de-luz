import { Flex, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { ReactElement } from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
interface Props {
  links?: {
    href: string
    icon: ReactElement
    label: string
  }[]
}
const LINKS: Props['links'] = [
  {
    href: process.env.NEXT_PUBLIC_IG_LINK || '',
    label: 'Instagram',
    icon: <FaInstagram />,
  },
  {
    href: process.env.NEXT_PUBLIC_WA_LINK || '',
    label: 'Whatsapp',
    icon: <FaWhatsapp />,
  },
]
export const SocialMedia = ({ links = LINKS }: Props) => (
  <Flex gap={1}>
    {links.map((link, index) => (
      <Link key={index} href={link.href} target="_blank">
        <IconButton variant="ghost" aria-label={link.label}>
          {link.icon}
        </IconButton>
      </Link>
    ))}
  </Flex>
)
