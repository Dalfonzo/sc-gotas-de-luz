import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import { methodRouter } from '~/lib/api/method-router'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const post = async () => {
    const message = {
      from: process.env.EMAIL_ADDRESS,
      to: req.body.email,
      subject: req.body.subject,
      text: req.body.message,
      html: `<p>${req.body.message}</p>`,
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    transporter.sendMail(message, (err: any) => {
      if (err) {
        res.status(404).json({
          error: `Connection refused at ${err.address}`,
        })
      } else {
        res.status(250).json({
          success: `Message delivered to ${req.body.email}`,
        })
      }
    })
  }

  await methodRouter(req, res, { post })
}
