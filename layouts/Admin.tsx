import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Container,
  Flex,
  Group,
  Header,
  Image,
  Indicator,
  MediaQuery,
  Navbar,
  NavbarProps,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core'
import {
  IconBuildingWarehouse,
  IconCalendar,
  IconHeartHandshake,
  IconHome,
  IconLock,
  IconLogout,
  IconNews,
  IconUserHeart,
  IconUsersGroup,
} from '@tabler/icons-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { useFetcher } from '~/hooks/fetcher'
import { useUserStore } from '~/store/users/useUserStore'
import { SWR_KEYS } from '~/utils/constants'

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.cyan[4],
  },

  version: {
    color: theme.white,
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.fn.lighten(theme.colors.cyan[4], 0.1)}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(theme.colors.cyan[4], 0.1)}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.fn.lighten(theme.colors.cyan[4], 0.1),
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.white,
    opacity: 0.75,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.lighten(theme.colors.cyan[4], 0.15),
      [`& .${getStylesRef('icon')}`]: {
        opacity: 0.9,
      },
    },
  },
}))

const linksRows = [
  { link: '/admin/dashboard', label: 'inicio', icon: IconHome },
  { link: '/admin/roles', label: 'roles', icon: IconLock },
  { link: '/admin/users', label: 'usuarios', icon: IconUsersGroup },
  { link: '/admin/donations', label: 'donaciones', icon: IconHeartHandshake, swr: SWR_KEYS.PENDING_DONATIONS },
  { link: '/admin/volunteers', label: 'voluntarios', icon: IconUserHeart, swr: SWR_KEYS.PENDING_VOLUNTEERS },
  { link: '/admin/inventory', label: 'inventario', icon: IconBuildingWarehouse, swr: SWR_KEYS.EXPIRING_INVENTORY },
  { link: '/admin/events', label: 'calendario', icon: IconCalendar },
  { link: '/admin/news', label: 'noticias', icon: IconNews },
]

export function NavbarSimpleColored({ isOpen, ...props }: Partial<NavbarProps> & { isOpen: boolean }) {
  const { classes, cx } = useStyles()
  const router = useRouter()
  const { fetcher } = useFetcher<{ pending: number }>()
  const { data: volunteerData } = useSWR<{ pending: number }>(SWR_KEYS.PENDING_VOLUNTEERS, fetcher)
  const { data: inventoryData } = useSWR<{ pending: number }>(SWR_KEYS.EXPIRING_INVENTORY, fetcher)
  const { data: donationData } = useSWR<{ pending: number }>(SWR_KEYS.PENDING_DONATIONS, fetcher)

  const swrIndicators = {
    [SWR_KEYS.PENDING_VOLUNTEERS]: volunteerData,
    [SWR_KEYS.EXPIRING_INVENTORY]: inventoryData,
    [SWR_KEYS.PENDING_DONATIONS]: donationData,
  }
  const links = linksRows.map((item) => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: router.asPath.startsWith(item.link) })}
      href={item.link}
      key={item.label}
      onClick={() => {
        router.push(item.link)
      }}
    >
      <Indicator
        label={item.swr && swrIndicators[item.swr]?.pending}
        disabled={!item.swr || !swrIndicators[item.swr]?.pending}
        inline
        size={16}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
      </Indicator>

      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <div>
          {isOpen && (
            <Text ml="sm" tt="capitalize">
              {item.label}
            </Text>
          )}
        </div>
      </MediaQuery>
    </Link>
  ))

  return (
    <Navbar height={'100vh'} top="0" p="md" className={classes.navbar} {...props}>
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Image
            src="/assets/svg/logo-footer.svg"
            alt="asd"
            width={isOpen ? 60 : 40}
            height={isOpen ? 60 : 40}
            mx="auto"
            mt="4"
            mb="5"
          />
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault()
            signOut({ redirect: true, callbackUrl: '/sign-in' })
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <div>{isOpen && <Text ml="sm">Logout</Text>}</div>
          </MediaQuery>
        </a>
      </Navbar.Section>
    </Navbar>
  )
}

const PageHeading = ({ title }: { title: string }) => {
  const item = linksRows.find((link) => link.label === title.toLowerCase())
  const { classes } = useStyles()
  return item ? (
    <Flex py="lg" align="center">
      <item.icon className={classes.linkIcon} stroke={1.5} color="black" />
      <Text ml="sm" tt="capitalize" color="dark" size="lg" weight="bold">
        {item.label}
      </Text>
    </Flex>
  ) : (
    <></>
  )
}

export const AdminLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const [opened, setOpened] = useState(true)
  const { data } = useSession()
  const { loadUser, isLoadingUserData } = useUserStore(({ loadUser, isLoadingUserData }) => ({
    loadUser,
    isLoadingUserData,
  }))

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <AppShell
      navbar={
        <NavbarSimpleColored
          width={{ sm: opened ? 300 : 80, base: opened ? 80 : '0px' }}
          display={{ sm: 'unset', base: opened ? 'unset' : 'none' }}
          isOpen={opened}
        />
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
      header={
        <Header
          height={{ base: 50, md: 60 }}
          p="md"
          left={{
            sm: opened ? 300 : 80,
            base: opened ? 80 : '0px',
          }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Burger opened={false} onClick={() => setOpened((o) => !o)} size="sm" mr="xl" color="gray" />
          <Box ml="auto">
            {data && (
              <Avatar color="indigo" radius="xl" tt="uppercase">
                {data.user?.name?.[0]}
              </Avatar>
            )}
          </Box>
        </Header>
      }
    >
      <Container size="lg" px="lg" py="md">
        <PageHeading title={title} />
      </Container>
      <Container size="lg" bg="white" px="lg" py="md" mih="350px" pos="relative">
        <UiFeedback isLoading={isLoadingUserData} minH={350} pt={100}>
          {children}
        </UiFeedback>
      </Container>
    </AppShell>
  )
}
