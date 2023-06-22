import { google } from 'googleapis'
export const getGoogleInstance = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_AUTH_TOKEN_PATH,
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
