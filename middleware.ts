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
    const decodedToken = await verifyJwt(token!)

    if (!token || !decodedToken) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
    }
  } else if (isClientRoute(pathname)) {
    const token = await getToken({ req })
    if (!token) return NextResponse.redirect(new URL('/sign-in', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
  pages: {
    signIn: '/sign-in',
  },
}
