import 'next-auth'
import { User } from '~/ts/User'

declare module 'next-auth' {
  interface Session {
    user: User
  }
}
