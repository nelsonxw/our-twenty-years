import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'generate-years.js'
)

let tmpDir
let data

beforeAll(() => {
  // Run the script inside an isolated sandbox so it writes to <tmp>/src/data
  // instead of the repo, keeping the test free of side effects.
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-years-'))
  const sandboxScripts = path.join(tmpDir, 'scripts')
  fs.mkdirSync(sandboxScripts, { recursive: true })
  fs.copyFileSync(scriptPath, path.join(sandboxScripts, 'generate-years.js'))

  execFileSync('node', ['generate-years.js'], { cwd: sandboxScripts })

  const out = path.join(tmpDir, 'src', 'data', 'years.json')
  data = JSON.parse(fs.readFileSync(out, 'utf-8'))
})

afterAll(() => {
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('generate-years script', () => {
  it('generates one entry per year from 2006 through 2026', () => {
    expect(data).toHaveLength(21)
    expect(data[0].year).toBe(2006)
    expect(data.at(-1).year).toBe(2026)
  })

  it('produces strictly increasing consecutive years', () => {
    const years = data.map((d) => d.year)
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBe(years[i - 1] + 1)
    }
  })

  it('derives hero and gallery image urls from the picsum seed base', () => {
    const first = data[0]
    expect(first.heroImage).toBe('https://picsum.photos/seed/2006/1920/1080')
    expect(first.galleryImages).toEqual([
      'https://picsum.photos/seed/2006-g1/800/600',
      'https://picsum.photos/seed/2006-g2/800/600',
      'https://picsum.photos/seed/2006-g3/800/600',
    ])
  })

  it('preserves the authored title, summary and milestones', () => {
    const first = data[0]
    expect(first.title).toBe('The Beginning')
    expect(first.summary).toContain('summer sky')
    expect(first.milestones).toContain('Wedding day')
  })

  it('gives every entry the full YearData shape', () => {
    for (const entry of data) {
      expect(typeof entry.year).toBe('number')
      expect(typeof entry.title).toBe('string')
      expect(typeof entry.summary).toBe('string')
      expect(entry.heroImage).toMatch(/^https:\/\/picsum\.photos\/seed\//)
      expect(entry.galleryImages).toHaveLength(3)
      expect(Array.isArray(entry.milestones)).toBe(true)
    }
  })
})
