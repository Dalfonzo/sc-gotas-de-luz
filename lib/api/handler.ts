import type { NextApiRequest, NextApiResponse } from 'next'

export async function basicHandler<Response>(
  callback: () => Response | Promise<Response>,
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const result = await callback()
    res.send(result)
  } catch (error) {
    console.error(error)

    res.status(500).end()
  }
}
