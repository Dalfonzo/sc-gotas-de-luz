import Email from 'email-templates'
import { existsSync } from 'fs'
import NodeMailer from 'nodemailer'
const path = require('path')

export interface EmailDataDto<Data = Record<string, any>> {
  url?: string
  name?: string
  title?: string
  data?: Data
  button?: string
}

export interface EmailSendDto<Data = Record<string, any>> {
  to: string | string[]
  subject: string
  templatePath: string
  data?: EmailDataDto<Data>
  attachments?: Array<any>
}

class NodemailerAdapter {
  private email: Email
  private transporter: NodeMailer.Transporter

  constructor() {
    this.email = new Email({
      views: {
        options: {
          extension: 'hbs',
        },
      },
    })
    const service = process.env.EMAIL_SERVICE
    this.transporter = NodeMailer.createTransport({
      ...(service && { service: service }),
      ...(process.env.EMAIL_HOST && { host: process.env.EMAIL_HOST }),
      ...(process.env.EMAIL_PORT && { port: parseInt(process.env.EMAIL_PORT) }),
      // Config if SMTP server is custom-owned
      ...(service === 'postfix' && {
        secureConnection: false,
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
      }),
      auth: {
        user: process.env.EMAIL_MAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  private loadTemplate(templateName: string, context: EmailDataDto): Promise<string> {
    const templatePath = path.join(process.cwd(), 'lib', 'mailer', 'templates', templateName)

    if (!existsSync(templatePath)) {
      throw new Error(`Email template [${templatePath}] not found`)
    }
    const websiteURL = process.env.NEXT_PUBLIC_SITE_URL

    const meta = {
      phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
      email: process.env.EMAIL_MAIL,
      websiteURL,
    }
    return new Promise((resolve, reject) => {
      this.email
        .render(templatePath, { url: websiteURL, ...context, meta })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  async sendEmail({ to, subject, templatePath, data = {}, attachments = [] }: EmailSendDto) {
    let template: string
    try {
      template = await this.loadTemplate(templatePath, {
        ...data,
      })
    } catch (error: any) {
      console.error(`Couldn't load email template [${error?.message}]`)
      return false
    }
    const emailName = process.env.EMAIL_NAME
    const emailMail = process.env.EMAIL_MAIL
    const mailOptions = {
      from: emailName ? `"${emailName}" <${emailMail}>` : emailMail,
      to: to,
      subject: subject,
      html: template,
      attachments,
    }
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error)
        } else {
          resolve('Email sent: ' + info.response)
        }
      })
    })
      .then(() => {
        console.log(`"${mailOptions.subject}" sent to ${mailOptions.to}`)
        return true
      })
      .catch((error) => {
        console.error(`Couldn't send email [${error.message}]`)
        return false
      })
  }
}

export const mailer = new NodemailerAdapter()
