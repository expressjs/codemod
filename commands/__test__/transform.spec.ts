import { join, resolve } from 'node:path'
import { run } from 'jscodeshift/src/Runner'
import prompts from 'prompts'
import { transform } from '../transform'

jest.mock('jscodeshift/src/Runner', () => ({
  run: jest.fn(),
}))

describe('interactive mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('runs without codemodName and source params provided', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    prompts.inject(['magic-redirect'])
    prompts.inject(['./transforms/__testfixtures__'])

    await transform(undefined, undefined, { dry: true, silent: true })

    expect(spyOnConsole).not.toHaveBeenCalled()
    expect(run).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledWith(
      join(__dirname, '../../', 'transforms/magic-redirect.js'),
      [resolve('./transforms/__testfixtures__')],
      {
        babel: false,
        dry: true,
        extensions: 'cts,mts,ts,js,mjs,cjs',
        ignorePattern: '**/node_modules/**',
        silent: true,
        verbose: 0,
      },
    )
  })

  it('runs properly on incorrect user input', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    prompts.inject(['magic-redirect'])

    await transform('bad-codemod', './transforms/__testfixtures__', {
      dry: true,
      silent: true,
    })

    expect(spyOnConsole).not.toHaveBeenCalled()
    expect(run).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledWith(
      join(__dirname, '../../', 'transforms/magic-redirect.js'),
      [resolve('./transforms/__testfixtures__')],
      {
        babel: false,
        dry: true,
        extensions: 'cts,mts,ts,js,mjs,cjs',
        ignorePattern: '**/node_modules/**',
        silent: true,
        verbose: 0,
      },
    )
  })

  it('runs with codemodName and without source param provided', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    prompts.inject(['__testfixtures__'])

    await transform('magic-redirect', undefined, {
      dry: true,
      silent: true,
    })

    expect(spyOnConsole).not.toHaveBeenCalled()
    expect(run).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledWith(
      join(__dirname, '../../', 'transforms/magic-redirect.js'),
      [resolve('__testfixtures__')],
      {
        babel: false,
        dry: true,
        extensions: 'cts,mts,ts,js,mjs,cjs',
        ignorePattern: '**/node_modules/**',
        silent: true,
        verbose: 0,
      },
    )
  })
})

describe('Non-Interactive Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Transforms code with codemodName and source params provided', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    await transform('magic-redirect', '__testfixtures__', {
      dry: true,
      silent: true,
    })

    expect(spyOnConsole).not.toHaveBeenCalled()
    expect(run).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledWith(
      join(__dirname, '../../', 'transforms/magic-redirect.js'),
      [resolve('__testfixtures__')],
      {
        babel: false,
        dry: true,
        extensions: 'cts,mts,ts,js,mjs,cjs',
        ignorePattern: '**/node_modules/**',
        silent: true,
        verbose: 0,
      },
    )
  })
})
