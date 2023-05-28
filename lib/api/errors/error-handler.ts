import { NextApiResponse } from 'next'
import { ApiError } from './api-error'

export async function errorHandler(callback: () => any, res: NextApiResponse) {
  try {
    await callback()
  } catch (error) {
    console.error(error)
    const parsed = {
      status: error instanceof ApiError ? error.status : 500,
      message: error instanceof Error ? error.message : 'Internal server error',
    }
    res.status(parsed.status).send({ cause: parsed.message })
  }
}
