import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get all files from the images directory
    const imagesDir = path.join(process.cwd(), 'public/images')
    const files = fs.readdirSync(imagesDir).filter(file =>
      file.toLowerCase().endsWith('.jpg') ||
      file.toLowerCase().endsWith('.jpeg') ||
      file.toLowerCase().endsWith('.png')
    )

    if (files.length === 0) {
      return res.status(404).json({ error: 'No images found' })
    }

    // Select a random image
    const randomImage = files[Math.floor(Math.random() * files.length)]
    const imagePath = path.join(imagesDir, randomImage)

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath)

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')

    // Send the image
    return res.send(imageBuffer)
  } catch (error) {
    console.error('Error serving random image:', error)
    return res.status(500).json({ error: 'Failed to serve random image' })
  }
}