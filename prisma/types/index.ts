import { Event, News } from '@prisma/client'
import { FileI } from '~/components/common/file-upload/FileUpload'
import { DateToString } from '~/lib/mappers/map-dates'

export interface CreateEvent extends DateToString<Omit<Event, 'id' | 'img' | 'imgId'>> {
  events?: FileI
}

export interface CreateNews extends Omit<News, 'id' | 'date' | 'img' | 'imgId'> {
  news?: FileI
}
