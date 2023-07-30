import * as jose from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || ''

export async function signJwtAccessToken(payload: jose.JWTPayload) {
  const token = await new jose.SignJWT(payload)
    // TODO: ADD this to .env
    .setExpirationTime('30d')
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(new TextEncoder().encode(SECRET_KEY))
  return token
}

export async function verifyJwt(token: string) {
  try {
    const sanitizedToken = token?.replace('Bearer', '').trim()
    // TODO: ADD verification for token expired.
    const decoded = await jose.jwtVerify(sanitizedToken, new TextEncoder().encode(SECRET_KEY))
    return decoded.payload
  } catch (error) {
    console.log(error)
    return null
  }
}
