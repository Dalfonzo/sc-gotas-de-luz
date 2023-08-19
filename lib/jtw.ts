import * as jose from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || ''
const TOKEN_EXPIRATION_TIME = process.env.AUTH_TOKEN_EXPIRATION_TIME || '30d'

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

    const decoded = await jose.jwtVerify(sanitizedToken, new TextEncoder().encode(secret))
    return { status: 'success', payload: decoded.payload }
  } catch (error: any) {
    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      return { status: 'error', code: 'JWS_VERIFICATION_FAILED', payload: error.message }
    } else if (error.code === 'ERR_JWT_EXPIRED') {
      return { status: 'error', code: 'TOKEN_EXPIRED', payload: error.message }
    }
    return { status: 'error', code: 'UNKNOWN', payload: error.message }
  }
}
