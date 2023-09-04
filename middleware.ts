export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from './lib/jtw'

const isApiRoute = (route: string) => route.startsWith('/api/admin')
const isClientRoute = (route: string) => route.startsWith('/admin')

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (isApiRoute(pathname)) {
    const token = req.headers.get('authorization')
    const errorOrDecodedToken = await verifyJwt(token!)
    if (!token || !errorOrDecodedToken || errorOrDecodedToken.code === 'TOKEN_EXPIRED') {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
    }
  } else if (isClientRoute(pathname)) {
    const token = await getToken({ req })
    const errorOrDecodedToken = await verifyJwt(token?.accessToken as string)

    if (!token || errorOrDecodedToken.code === 'TOKEN_EXPIRED') {
      // close session first
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
  pages: {
    signIn: '/sign-in',
  },
}
