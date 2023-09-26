import { Box, Button, Image, Text } from '@chakra-ui/react'
import { useToggle } from '@mantine/hooks'
import { Donation } from '@prisma/client'
import Link from 'next/link'
import useSWR from 'swr'
import BasicModal from '~/components/common/Modal'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import { responsiveProperty } from '~/theme/utils'
import { DonateReducerActionKind, useDonate } from '../donate-context.provider'
import { DonationFeed } from '../donation-list/Feed'
import DonatorCard from './DonatorCard'
type FetchResult = Donation[]

const CARD_MARGINS_LEFT = [{ base: 'unset', sm: '-2rem' }, undefined, { base: 'unset', sm: '-5rem' }]

const LatestDonators = () => {
  const { fetcher } = useFetcher<FetchResult>()
  const [visible, toggle] = useToggle()
  const { updateFormToggle } = useDonate()

  const {
    data: donations,
    error,
    isLoading,
  } = useSWR<usePaginationFetcherResponse<FetchResult>>(
    [
      `/api/donation`,
      {
        usePagination: true,
        dates: ['date'],
        query: {
          page: 0,
          size: 3,
        },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<FetchResult>) => fetcher(url, dto)
  )
  return (
    <Box as="section" px="1rem">
      <Box
        display="flex"
        alignItems="center"
        flexDir={{ base: 'column', lg: 'row' }}
        gap={{ base: '2rem', md: '3rem', lg: '4rem' }}
      >
        <Box width={{ base: '100%', lg: '40%' }} alignSelf={{ base: 'flex-start', lg: 'unset' }}>
          <Text variant="subtitle-no-decoration" as="h2">
            Nuestros últimos benefactores
          </Text>
          <Text variant="normal" marginTop={responsiveProperty({ mobileSize: 0.5, desktopSize: 2, unit: 'rem' })}>
            ¡Gracias a todos los que hacen esto posible!
          </Text>
        </Box>
        <UiFeedback
          isLoading={isLoading}
          emptyMsg={['Sin donaciones que mostrar', '¡Iremos mostrando las donaciones a penas las veriquemos!']}
          isError={error}
          errorMsg={[
            'Lo sentimos, ha ocurrido un error al cargar las últimas donaciones',
            'Intenta cargar la página nuevamente',
          ]}
          loadingType="skeleton"
          loadingItems={3}
          isEmpty={!donations?.total}
        >
          <Box
            width="fit-content"
            display="flex"
            flexDirection="column"
            gap="1.5rem"
            marginLeft={{ base: 'unset', sm: '130px', lg: 'auto' }}
            position="relative"
          >
            {(donations?.records.length ?? 0) > 2 && (
              <Image
                src="assets/svg/arrow.svg"
                alt="arrow"
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                left={responsiveProperty({ mobileSize: -40, desktopSize: -30, unit: '%' })}
                display={{ base: 'none', sm: 'unset' }}
              />
            )}
            {donations?.records.map((donation, index) => (
              <DonatorCard
                name={donation.name || 'Anónimo'}
                amount={donation.amount}
                comment={donation.message || ''}
                date={donation.date}
                marginLeft={CARD_MARGINS_LEFT[index]}
                key={index}
              />
            ))}
          </Box>
        </UiFeedback>
      </Box>
      <Button
        display="block"
        width="12rem"
        margin="auto"
        variant="btn-white-border"
        color="aqua.light"
        marginTop={{ base: '2rem', sm: '3rem', md: '4rem' }}
        onClick={() => toggle()}
      >
        Ver todos
      </Button>
      <BasicModal
        scrollBehavior="inside"
        title={'Donativos'}
        visible={visible}
        onClose={toggle}
        size="lg"
        body={
          <Box>
            <DonationFeed />
            <Link
              href="/donate#button"
              onClick={() => {
                toggle()
                updateFormToggle(DonateReducerActionKind.OPEN)
              }}
            >
              <Button size="lg" backgroundColor="yellow" w="100%" bottom={0} position="sticky">
                Donar Ahora
              </Button>
            </Link>
          </Box>
        }
      />
    </Box>
  )
}

export default LatestDonators
