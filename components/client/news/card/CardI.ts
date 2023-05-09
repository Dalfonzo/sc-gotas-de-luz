import { BoxProps } from '@chakra-ui/react'
import { NewsI } from '~/lib/models/news'
interface CardI extends Omit<BoxProps, 'title' | 'id' | 'content'>, NewsI {}
export default CardI
