import { BoxProps } from '@chakra-ui/react'
interface CardI extends BoxProps {
  imgSrc: string
  title: string
  content: string
  date: string
  id: any
}

export default CardI
