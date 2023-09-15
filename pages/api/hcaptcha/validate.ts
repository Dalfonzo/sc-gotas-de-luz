import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const post = async () => {
    const params = new URLSearchParams()
    // @ts-ignore
    params.append('secret', process.env.HCAPTCHA_SECRET as string)
    params.append('response', req.body['g-recaptcha-response'] || req.body['h-captcha-response'] || req.body.token)
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (response?.ok) {
      return 'ok'
    }
    throw new BadRequestError(`Invalid catpcha response`)
  }
  await methodRouter(req, res, { post })
}
