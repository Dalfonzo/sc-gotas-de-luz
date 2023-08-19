import { Unauthorized } from '~/components/admin/common/unauthorized/Unauthorized'
import useAccessGuard from '~/hooks/useAccessGuard'
import { AdminLayout } from '~/layouts/Admin'
import { OperationsOptions } from '~/ts/OperationsOptions'

export const withProtectedRoute = <TProps extends object>(
  Component: React.FC<TProps>,
  { operation, resource, title }: { operation: OperationsOptions; resource: string; title: string }
) => {
  return function WrappedComponent(props: TProps) {
    const { isOpAllowed } = useAccessGuard({ operation, resource })
    const opIsAllowed = isOpAllowed()
    return <AdminLayout title={title}>{!opIsAllowed ? <Unauthorized /> : <Component {...props} />}</AdminLayout>
  }
}
