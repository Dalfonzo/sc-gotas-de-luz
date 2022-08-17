import { BoxProps, ListItem, UnorderedList } from '@chakra-ui/react'
import Card from './Card'
import CardI from './CardI'

interface ListI extends BoxProps {
  news: CardI[]
}

const NewsList = ({ news, ...rest }: ListI) => {
  return (
    <UnorderedList justifyContent="center" flexWrap="wrap" listStyleType="none" display="flex" flexDirection="row">
      {news.map((newsElement) => (
        <ListItem key={newsElement.id} margin="1rem">
          <Card key={newsElement.id} {...newsElement} {...rest}></Card>
        </ListItem>
      ))}
    </UnorderedList>
  )
}

export default NewsList
