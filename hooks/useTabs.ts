import { useRouter } from 'next/router'
import { useState } from 'react'

export const useTabs = (defaultTab: string) => {
  const router = useRouter()

  const [currentTab, setCurrentTab] = useState<string>(router.query.tab ? String(router.query.tab) : defaultTab)

  const onTabChange = async (tab: string) => {
    await router.replace({
      query: {
        tab: tab,
      },
    })
    setCurrentTab(tab)
  }

  return {
    currentTab,
    onTabChange,
  }
}
