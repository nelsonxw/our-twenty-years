import { Storage } from '@google-cloud/storage'
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, relative, sep, posix } from 'path'

const KEY_FILE = './service-account.json'
const BUCKET_NAME = 'our-twenty-years.firebasestorage.app'
const PUBLIC_DIR = './public'
const DIRS = ['images', 'videos']

const storage = new Storage({ keyFilename: KEY_FILE })
const bucket = storage.bucket(BUCKET_NAME)

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function toRemoteUrl(dest) {
  const segments = dest.split(posix.sep).map(encodeURIComponent)
  return `https://storage.googleapis.com/${BUCKET_NAME}/${segments.join('/')}`
}

async function main() {
  const files = []
  for (const d of DIRS) {
    const dir = join(PUBLIC_DIR, d)
    if (statSync(dir, { throwIfNoEntry: false })) {
      for (const f of walk(dir)) files.push(f)
    }
  }

  console.log(`Found ${files.length} files to upload`)
  let i = 0
  for (const localPath of files) {
    const dest = relative(PUBLIC_DIR, localPath).split(sep).join(posix.sep)
    await bucket.upload(localPath, { destination: dest, public: true })
    i++
    if (i % 10 === 0 || i === files.length) console.log(`Uploaded ${i}/${files.length}: ${dest}`)
  }

  console.log('All uploads complete. Updating years.json...')
  const json = readFileSync('src/data/years.json', 'utf8')
  const updated = json.replace(/"(\/(images|videos)\/[^"]*)"/g, (m, p) => {
    const dest = p.slice(1)
    const remote = toRemoteUrl(dest)
    return `"${remote}"`
  })
  writeFileSync('src/data/years.json', updated)
  console.log('years.json updated.')
}

main().catch(err => {
  console.error('Upload failed:', err)
  process.exit(1)
})   
