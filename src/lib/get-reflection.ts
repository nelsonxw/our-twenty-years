import fs from 'fs/promises'
import path from 'path'

export async function getReflection() {
  const filePath = path.join(process.cwd(), 'content', 'reflection.md')
  return fs.readFile(filePath, 'utf-8')
}
