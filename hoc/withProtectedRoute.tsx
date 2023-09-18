import { Unauthorized } from '~/components/admin/common/unauthorized/Unauthorized'
import useAccessGuard from '~/hooks/useAccessGuard'
import { AdminLayout } from '~/layouts/Admin'
import { OperationsOptions } from '~/ts/OperationsOptions'

export const withProtectedRoute = <TProps extends object>(
  Component: React.FC<TProps>,
  {
    operation,
    resource,
    title,
    variant = 'bg',
  }: { operation: OperationsOptions; resource: string; title: string; variant?: 'no-bg' | 'bg' }
) => {
  return function WrappedComponent(props: TProps) {
    const { isOpAllowed } = useAccessGuard({ operation, resource })
    const opIsAllowed = isOpAllowed()
    return (
      <AdminLayout title={title} variant={variant}>
        {!opIsAllowed ? <Unauthorized /> : <Component {...props} />}
      </AdminLayout>
    )
  }
}
