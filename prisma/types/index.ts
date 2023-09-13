import { Category, Donation, DonationMethod, Event, FileDb, Inventory, News, Volunteer } from '@prisma/client'
import { FileI } from '~/components/common/file-upload/FileUpload'
import { DateToString } from '~/lib/mappers/map-dates'

export interface CreateEvent extends DateToString<Omit<Event, 'id' | 'img' | 'imgId'>> {
  events?: FileI
}

export interface CreateNews extends Omit<News, 'id' | 'date' | 'img' | 'imgId'> {
  news?: FileI
}

export interface CreateVolunteer extends Omit<Volunteer, 'id' | 'date' | 'isActive' | 'formReference'> {
  formReference?: string
}

export interface CreateCategory extends Omit<Category, 'id' | 'inventories'> {}

export interface CreateInventory
  extends Omit<Inventory, 'id' | 'category' | 'currentQuantity' | 'updatedAt' | 'categoryId'> {
  categoryId: string
}

export interface PendingResult {
  pending: number
}

export interface CreateDonation extends Omit<Donation, 'id' | 'img' | 'imgId' | 'isVerified' | 'date' | 'createdAt'|'emailSent'> {
  date: string
  donation?: FileI
}

export interface IncludeDonation extends Donation {
  method: DonationMethod
  img?: FileDb
}
