import { ActionIcon, Select, SelectProps } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'

interface Props extends Omit<SelectProps, 'value'> {
  selected: string | null
  setSelected: Dispatch<SetStateAction<string | null>> | ((e: any) => any)
}
export const CustomSelect = ({ selected, setSelected, ...rest }: Props) => {
  return (
    <Select
      {...rest}
      value={selected}
      onChange={(value) => setSelected(value)}
      rightSection={
        selected ? (
          <ActionIcon onClick={() => setSelected(null)}>
            <IconX size="1rem" />
          </ActionIcon>
        ) : undefined
      }
    />
  )
}
