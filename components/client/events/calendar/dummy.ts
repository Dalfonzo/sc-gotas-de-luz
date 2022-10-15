import { EventI } from '~/lib/models/event'

const events: EventI[] = [
  {
    id: 1,
    start: new Date('2022-09-01'),
    end: new Date('2022-09-02'),
    title: 'Nuevo evento!',
    description:
      'Ut ex velit cupidatat qui irure aliqua quis duis eiusmod tempor irure. Esse proident magna quis ad do officia velit adipisicing. Cillum veniam quis Lorem ad officia anim laboris. Magna cupidatat ut nisi exercitation cillum pariatur consectetur consequat.',
  },
  {
    id: 2,
    start: new Date('2022-09-07'),
    end: new Date('2022-09-07'),
    title: '¡Increíble recoleccion!',
    description:
      'Ut ex velit cupidatat qui irure aliqua quis duis eiusmod tempor irure. Esse proident magna quis ad do officia velit adipisicing. Cillum veniam quis Lorem ad officia anim laboris. Magna cupidatat ut nisi exercitation cillum pariatur consectetur consequat.',
    link: 'https://www.google.com/',
  },
]
export default events
