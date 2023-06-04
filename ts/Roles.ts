import { Permissions } from './Permissions'

export interface Roles {
  id: string
  name: string
  description?: string
  permissions: Permissions[]
}
