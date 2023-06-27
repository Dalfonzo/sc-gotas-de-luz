import { OperationsOptions } from '~/ts/OperationsOptions'

export const HTTP_METHODS = {
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
}
// TODO: quizás cambiar los nombres de recursos a español para mostrarlos en el admin
export const RESOURCES = {
  NEWS: 'NEWS',
  USERS: 'USERS',
  ROLES: 'ROLES',
  EVENTS: 'EVENTS',
  VOLUNTEERS: 'VOLUNTEERS',
}

export const OPERATION_METHODS: Record<OperationsOptions, OperationsOptions> = {
  READ: 'READ',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
}

export const SWR_KEYS = {
  PENDING_VOLUNTEERS: '/api/admin/volunteers/pending',
}
