import { ParsedPermission } from './Permissions'
import { Roles } from './Roles'

export interface User {
  id: string
  name: string
  lastName: string
  email: string
  fkRole: string
  roles: Roles
  permissions: Record<string, ParsedPermission>
  accessToken: string
}
