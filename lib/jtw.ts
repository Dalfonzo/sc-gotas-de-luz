import * as jose from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || ''
// TODO: ADD this to .env
const TOKEN_EXPIRATION_TIME = '30d'

export async function signJwtAccessToken(
  payload: jose.JWTPayload,
  secretKey = SECRET_KEY,
  expirationTime = TOKEN_EXPIRATION_TIME
) {
  const token = await new jose.SignJWT(payload)
    .setExpirationTime(expirationTime)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(new TextEncoder().encode(secretKey))
  return token
}

export async function verifyJwt(token: string, secret = SECRET_KEY) {
  try {
    const sanitizedToken = token?.replace('Bearer', '').trim()
    // TODO: ADD verification for token expired.
    const decoded = await jose.jwtVerify(sanitizedToken, new TextEncoder().encode(secret))
    return decoded.payload
  } catch (error) {
    console.log(error)
    return null
  }
}
