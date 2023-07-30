import { ParsedPermission, Permissions } from '~/ts/Permissions'

export const parsePermissions = (permissions: Permissions[]) => {
  return permissions.reduce((prev, curr) => {
    prev[curr.resources.name.toUpperCase()] = {
      CREATE: curr.create,
      UPDATE: curr.update,
      READ: curr.read,
      DELETE: curr.delete,
    }
    return prev
  }, {} as ParsedPermission)
}
