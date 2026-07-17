import { describe, it, expect, vi, beforeEach } from 'vitest'

const readFile = vi.fn()

vi.mock('fs/promises', () => ({
  default: {
    readFile: (...args: unknown[]) => readFile(...args),
  },
}))

import { getReflection } from './get-reflection'

describe('getReflection', () => {
  beforeEach(() => {
    readFile.mockReset()
  })

  it('reads content/reflection.md relative to cwd as utf-8', async () => {
    readFile.mockResolvedValue('# Hello')
    const result = await getReflection()

    expect(result).toBe('# Hello')
    expect(readFile).toHaveBeenCalledTimes(1)
    const [filePath, encoding] = readFile.mock.calls[0]
    expect(String(filePath).replace(/\\/g, '/')).toContain('content/reflection.md')
    expect(String(filePath)).toContain(process.cwd())
    expect(encoding).toBe('utf-8')
  })

  it('propagates read errors', async () => {
    readFile.mockRejectedValue(new Error('ENOENT'))
    await expect(getReflection()).rejects.toThrow('ENOENT')
  })
})
