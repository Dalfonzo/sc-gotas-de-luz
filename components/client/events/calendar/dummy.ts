import { EventI } from '~/lib/models/event'

const events: EventI[] = [
  {
    id: 1,
    start: new Date('2022-09-01'),
    end: new Date('2022-09-02'),
    title: 'Nuevo evento!',
    img: 'https://media.istockphoto.com/photos/canadian-rockies-banff-national-park-dramatic-landscape-picture-id1342152935?b=1&k=20&m=1342152935&s=170667a&w=0&h=q9-vhO5MC7zwaxX8_zFUiqMnQJ5udMjEBf0npeCCAGs=',
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
  },
]
export default events
