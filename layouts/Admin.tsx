import { Portal, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import Footer from '~/components/admin/footer/Footer'
import AdminNavbar from '~/components/admin/navbars/AdminNavbar'
import Sidebar from '~/components/admin/sidebar'
import MainPanel from '../components/admin/layout/MainPanel'
import PanelContainer from '../components/admin/layout/PanelContainer'
import PanelContent from '../components/admin/layout/PanelContent'

export default function Admin({ children }: { children: React.ReactNode }) {
  const { onOpen } = useDisclosure()
  const router = useRouter()

  return (
    <>
      <Sidebar />
      <MainPanel
        w={{
          base: '100%',
          xl: 'calc(100% - 275px)',
        }}
      >
        <Portal>
          <AdminNavbar onOpen={onOpen} logoText={'Gotas de Luz'} brandText={router.pathname.split('/').reverse()[0]} />
        </Portal>
        <PanelContent>
          <PanelContainer>{children}</PanelContainer>
        </PanelContent>
        <Footer />
      </MainPanel>
    </>
  )
}
