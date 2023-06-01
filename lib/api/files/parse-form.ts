import formidable from 'formidable'
import type { NextApiRequest } from 'next'

export type FormidableParseReturn = {
  fields: formidable.Fields
  files: formidable.Files
}

export async function parseFormAsync(
  req: NextApiRequest,
  formidableOptions?: formidable.Options
): Promise<FormidableParseReturn> {
  const form = formidable(formidableOptions)
  return await new Promise<FormidableParseReturn>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err)
      }
      const parsedFields: Record<keyof formidable.Fields, string> = {}
      for (let [key, value] of Object.entries(fields)) {
        parsedFields[key] = Array.isArray(value) ? value[0] : value
      }
      resolve({ fields: parsedFields, files })
    })
  })
}
