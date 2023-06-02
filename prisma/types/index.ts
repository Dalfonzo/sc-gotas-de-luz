import { Event, News } from '@prisma/client'
import { FileI } from '~/components/common/file-upload/FileUpload'

export interface CreateEvent extends Omit<Event, 'id'> {}
export interface CreateNews extends Omit<News, 'id' | 'date' | 'img' | 'imgId'> {
  news?: FileI
}
