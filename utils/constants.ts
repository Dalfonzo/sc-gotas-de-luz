import { Prisma } from '@prisma/client'
import { OperationsOptions } from '~/ts/OperationsOptions'

export const HTTP_METHODS = {
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
}
export const RESOURCES = {
  NEWS: 'NOTICIAS',
  USERS: 'USUARIOS',
  ROLES: 'ROLES',
  EVENTS: 'EVENTOS (CALENDARIO)',
  VOLUNTEERS: 'VOLUNTARIOS',
  INVENTORY: 'INVENTORIO',
}
// to be used on api routes that don't relate to a specific resource
export const FREE_RESOURCE: 'NONE' = 'NONE'

export const OPERATION_METHODS: Record<OperationsOptions, OperationsOptions> = {
  READ: 'READ',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
}

export const SWR_KEYS = {
  PENDING_VOLUNTEERS: '/api/admin/volunteers/pending',
}

export const LINKS = {
  VOLUNTEER_FORM: `https://docs.google.com/forms/d/${process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEERS_ID}/viewform?ts=60be461e&edit_requested=true`,
}

export const UNPROTECTED_RESOURCES: Record<string, string> = {
  DASHBOARD: 'DASHBOARD',
}

export const BASE_CATEGORIES: Prisma.CategoryCreateInput[] = [
  { name: 'Alimentos' },
  { name: 'Medicamentos' },
  { name: 'Juguetes' },
  { name: 'Ropa' },
  { name: 'Otros' },
]
