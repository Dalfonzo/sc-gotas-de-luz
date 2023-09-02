import { Box } from '@chakra-ui/react'
import { Stack } from '@mantine/core'
import { Donation } from '@prisma/client'
import DonatorCard from '../latest-donators/DonatorCard'

interface Props {
  donations: Donation[]
}
export const DonationList = ({ donations }: Props) => {
  return (
    <Stack align="flex-start">
      {donations.map((don, i) => (
        <Box w="100%" key={i}>
          <DonatorCard
            shadow="none"
            name={don.name || 'Anónimo'}
            amount={don.amount}
            date={don.date}
            comment={don.message || ''}
          />
        </Box>
      ))}
    </Stack>
  )
}
