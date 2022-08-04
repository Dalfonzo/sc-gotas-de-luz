import React from 'react'
import Footer from '~/components/client/footer'
import Header from '~/components/client/header'

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
