import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Link, LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'

interface LinkButtonI extends LinkProps {
  href: string
  content: string
  withArrow?: boolean
}

const LinkButton = ({ href, variant, content, withArrow = true, ...rest }: LinkButtonI) => {
  return (
    <NextLink href={href} passHref>
      <Link variant={variant} {...rest}>
        {content} {withArrow && <ArrowForwardIcon />}
      </Link>
    </NextLink>
  )
}

export default LinkButton
