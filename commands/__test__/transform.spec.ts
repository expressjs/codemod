import prompts from 'prompts'
import { transform } from '../transform'
import path from 'node:path'

describe('transform action', () => {
  describe('interative mode', () => {
    it('Transform code without ', async () => {
      prompts.inject(['magic-redirect'])
      prompts.inject([path.resolve(process.cwd(), './transforms/__testfixtures__')])
      const res = await transform(undefined, undefined, { dry: true, silent: true })
      expect(res.ok).toBe(2)
      expect(res.error).toBe(0)
    }, 10000)

    it('No prompts', async () => {
      const res = await transform('magic-redirect', path.resolve(process.cwd(), './transforms/__testfixtures__'), {
        dry: true,
        silent: true,
      })
      expect(res.ok).toBe(2)
      expect(res.error).toBe(0)
    }, 10000)

    it('Bad codemod user input', async () => {
      prompts.inject(['magic-redirect'])
      const res = await transform('bad-codemod', path.resolve(process.cwd(), './transforms/__testfixtures__'), {
        dry: true,
        silent: true,
      })
      expect(res.ok).toBe(2)
      expect(res.error).toBe(0)
    })

    it('Bad source user input', async () => {
      prompts.inject([path.resolve(process.cwd(), './transforms/__testfixtures__')])
      const res = await transform('magic-redirect', undefined, {
        dry: true,
        silent: true,
      })

      expect(res.ok).toBe(2)
      expect(res.error).toBe(0)
    })
  })
})
