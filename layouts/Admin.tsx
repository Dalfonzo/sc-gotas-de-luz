import { Portal, useDisclosure } from '@chakra-ui/react'
import Footer from 'components/Footer/Footer'
import AdminNavbar from 'components/Navbars/AdminNavbar'
import Sidebar from 'components/Sidebar'
import { useRouter } from 'next/router'
import React from 'react'
import MainPanel from '../components/Layout/MainPanel'
import PanelContainer from '../components/Layout/PanelContainer'
import PanelContent from '../components/Layout/PanelContent'

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
