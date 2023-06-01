import { Event, News } from '@prisma/client'

export interface CreateEvent extends Omit<Event, 'id'> {}
export interface CreateNews extends Omit<News, 'id' | 'date' | 'img' | 'imgId'> {
    news?: File
}
