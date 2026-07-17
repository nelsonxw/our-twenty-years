import fs from 'fs/promises'
import path from 'path'

export async function getReflection() {
  const filePath = path.join(process.cwd(), 'content', 'reflection.md')

  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    throw new Error(
      `Failed to read reflection content at ${filePath}`,
      { cause: error }
    )
  }
}
