import { useUserStore } from '~/store/users/useUserStore'
import { OperationsOptions } from '~/ts/OperationsOptions'
import { OPERATION_METHODS } from '~/utils/constants'

const useAccessGuard = ({
  resource,
  operation = OPERATION_METHODS.READ,
}: {
  resource: string
  operation?: OperationsOptions
}) => {
  const { permissions } = useUserStore(({ permissions }) => ({ permissions }))

  const isAllowed = ({ resource, operation }: { resource: string; operation: OperationsOptions }) => {
    return permissions?.[resource]?.[operation]
  }

  const canRead = isAllowed({ resource, operation: OPERATION_METHODS.READ })
  const canDelete = isAllowed({ resource, operation: OPERATION_METHODS.DELETE })
  const canUpdate = isAllowed({ resource, operation: OPERATION_METHODS.UPDATE })
  const canCreate = isAllowed({ resource, operation: OPERATION_METHODS.CREATE })
  const isOpAllowed = () => isAllowed({ resource, operation })

  return { isAllowed, canRead, canDelete, canUpdate, canCreate, isOpAllowed }
}

export default useAccessGuard
