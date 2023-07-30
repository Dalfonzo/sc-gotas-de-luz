import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '~/ts/User'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials: any, req) {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email as string,
            password: credentials?.password,
          }),
        })

        const user = await res.json()
        if (user) return user
        return null
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  callbacks: {
    async session({ session, token }) {
      session.user = { ...session.user, ...token } as User
      return session
    },
    jwt({ token, user }) {
      return { ...user, ...token }
    },
  },
})
