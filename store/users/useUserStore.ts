import { getSession } from 'next-auth/react'
import { create } from 'zustand'
import { Permissions } from '~/ts/Permissions'
import { parsePermissions } from '~/utils/parsePermissions'

interface State {
  user: any
  permissions: any
  loadUser: () => Promise<void>
  isLoadingUserData: boolean
}

export const useUserStore = create<State>((set) => ({
  user: {},
  permissions: {},
  isLoadingUserData: true,
  loadUser: async () => {
    set((state) => ({ ...state, isLoadingUserData: true }))
    const session = await getSession()

    if (!session) {
      set((state) => ({ ...state, isLoadingUserData: false }))
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/users/${session?.user?.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      })
      const user = await response.json()
      set((state) => ({
        ...state,
        user,
        permissions: parsePermissions(user.roles.permissions as Permissions[]),
      }))
    } catch (error) {
      console.log(error)
    } finally {
      set((state) => ({ ...state, isLoadingUserData: false }))
    }
  },
}))
