import { AiFillHome } from 'react-icons/ai'
import { FaUserAlt } from 'react-icons/fa'
import { RoutesI } from './types'

var dashRoutes: RoutesI[] = [
  {
    path: '/admin/dashboard',
    name: 'Inicio',
    icon: AiFillHome,
  },
  {
    path: '/admin/auth/profile',
    name: 'Perfil',
    icon: FaUserAlt,
  },
]
export default dashRoutes
