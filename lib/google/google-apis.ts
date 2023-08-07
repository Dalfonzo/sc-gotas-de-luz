import { readFileSync } from 'fs'
import { google } from 'googleapis'

export const getGoogleInstance = () => {
  const jsonCredentials = process.env.GOOGLE_AUTH_CRENDENTIALS
  const auth = new google.auth.GoogleAuth({
    ...(jsonCredentials
      ? { credentials: JSON.parse(jsonCredentials) }
      : {
          keyFile: process.env.GOOGLE_AUTH_TOKEN_PATH,
        }),

    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/forms.body.readonly',
      'https://www.googleapis.com/auth/forms.responses.readonly',
    ],
  })

  google.options({ auth: auth })

  return google.forms('v1').forms
}
type GoogleCreds = {
  client_id: string
  private_key: string
} | null
export const getGoogleCredentials = (): GoogleCreds => {
  const file = process.env.GOOGLE_AUTH_TOKEN_PATH ? process.env.GOOGLE_AUTH_TOKEN_PATH : null
  if (!file) return null
  const raw = readFileSync(file)
  return JSON.parse(raw.toString())
}
