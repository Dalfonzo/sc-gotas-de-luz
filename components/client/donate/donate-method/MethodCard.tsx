import { Card, Text, createStyles } from '@mantine/core'

interface Props {
  reference: string
  name: string
  onClick: () => void
  isSelected: boolean
}

const useStyles = createStyles((theme) => ({
  card: {
    ':hover': {
      border: `2px solid ${theme.colors.cyan[2]}`,
    },
  },
  selected: {
    border: `2px solid ${theme.colors.cyan[4]} !important`,
  },
}))
export const MethodCard = ({ name, reference, onClick, isSelected }: Props) => {
  const { classes, cx } = useStyles()
  return (
    <Card
      withBorder
      className={cx(classes.card, { [classes.selected]: isSelected })}
      style={{ cursor: 'pointer' }}
      shadow="xs"
      onClick={() => onClick()}
    >
      <Text weight={700} fz="lg">
        {name}
      </Text>
      <Text dangerouslySetInnerHTML={{ __html: reference }}></Text>
    </Card>
  )
}
