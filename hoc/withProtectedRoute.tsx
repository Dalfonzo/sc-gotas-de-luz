import { useSession } from 'next-auth/react'
import CustomLoader from '~/components/admin/common/loader/Loader'
import { Unauthorized } from '~/components/admin/common/unauthorized/Unauthorized'
import useAccessGuard from '~/hooks/useAccessGuard'
import { AdminLayout } from '~/layouts/Admin'
import { OperationsOptions } from '~/ts/OperationsOptions'

export const withProtectedRoute = <TProps extends object>(
  Component: React.FC<TProps>,
  { operation, resource, title }: { operation: OperationsOptions; resource: string; title: string }
) => {
  return function WrappedComponent(props: TProps) {
    const { data } = useSession()
    const { isOpAllowed } = useAccessGuard({ operation, resource })

    const permissions = data?.user.permissions
    const opIsAllowed = isOpAllowed()
    return (
      <AdminLayout title={title}>
        {!data || !permissions ? <CustomLoader /> : !opIsAllowed ? <Unauthorized /> : <Component {...props} />}
      </AdminLayout>
    )
  }
}
