import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Link, LinkProps } from '@chakra-ui/react'

interface LinkButtonI extends LinkProps {
  href: string
  content: string
  withArrow?: boolean
}

const LinkButton = ({ href, variant, content, withArrow = true, ...rest }: LinkButtonI) => {
  return (
    <Link variant={variant} href={href} {...rest}>
      {content} {withArrow && <ArrowForwardIcon />}
    </Link>
  )
}

export default LinkButton
