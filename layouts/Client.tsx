import React from 'react'
import Footer from '~/components/client/common/footer'
import Header from '~/components/client/common/header'

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default ClientLayout
