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
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email as string,
              password: credentials?.password,
            }),
          })

          const payload = await res.json()

          if (res.status === 200 && payload) {
            return payload
          }

          return null
        } catch (error) {
          console.log({ error })
        }
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
