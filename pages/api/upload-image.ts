import type { NextApiRequest, NextApiResponse } from 'next'
import cloudinary from 'cloudinary'
import formidable from 'formidable'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const form = formidable({ multiples: false })
    const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    // Try to find a file under key 'file' or the first file in the object
    let uploadedFile: formidable.File | undefined
    const fileEntry = (files as Record<string, formidable.File | formidable.File[]>)['file']
    if (Array.isArray(fileEntry)) uploadedFile = fileEntry[0]
    else if (fileEntry) uploadedFile = fileEntry
    else {
      const firstKey = Object.keys(files)[0]
      const first = firstKey ? (files as Record<string, formidable.File | formidable.File[]>)[firstKey] : undefined
      uploadedFile = Array.isArray(first) ? first[0] : first
    }

    if (!uploadedFile || typeof (uploadedFile as formidable.File).filepath !== 'string') {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const upload = await cloudinary.v2.uploader.upload((uploadedFile as formidable.File).filepath, {
      folder: 'lightnote-images',
      resource_type: 'image',
    })
    return res.status(200).json({ url: upload.secure_url })
  } catch (error) {
    console.error('Upload API error:', error instanceof Error ? error.message : error)
    return res.status(500).json({ error: 'Upload failed' })
  }
}
