import { OperationsOptions } from '~/ts/OperationsOptions'

export const HTTP_METHODS = {
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
}

export const RESOURCES = {
  NEWS: 'NEWS',
  USERS: 'USERS',
  ROLES: 'ROLES',
  EVENTS: 'EVENTS',
}

export const OPERATION_METHODS: Record<OperationsOptions, OperationsOptions> = {
  READ: 'READ',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
}
