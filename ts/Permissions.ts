import { Resources } from './Resources'

export interface Permissions {
  create: boolean
  update: boolean
  delete: boolean
  read: boolean
  roleId: string
  resourceId: string
  resources: Resources
}

export interface ParsedPermission {
  [resourceName: string]: { CREATE: boolean; UPDATE: boolean; READ: boolean; DELETE: boolean }
}
