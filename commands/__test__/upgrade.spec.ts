import { run } from 'jscodeshift/src/Runner'
import prompts from 'prompts'
import { upgrade } from '../upgrade'

jest.mock('jscodeshift/src/Runner', () => ({
  run: jest.fn(),
}))

describe('interactive mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('runs without source params provided and select is true', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    prompts.inject([['magic-redirect', 'req-param']])

    await upgrade('__testfixtures__', { select: true })

    expect(spyOnConsole).toHaveBeenCalled()
    expect(spyOnConsole).toHaveBeenCalledTimes(3)
    expect(run).toHaveBeenCalledTimes(2)
  })

  it('runs with source params provided and select is true', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    prompts.inject([['magic-redirect', 'req-param']])

    await upgrade('__testfixtures__', { select: true })

    expect(spyOnConsole).toHaveBeenCalled()
    expect(spyOnConsole).toHaveBeenCalledTimes(3)
    expect(run).toHaveBeenCalledTimes(2)
  })

  it('runs without source params provided and select is undefined', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    prompts.inject(['__testfixtures__'])

    await upgrade(undefined)

    expect(spyOnConsole).toHaveBeenCalled()
    expect(spyOnConsole).toHaveBeenCalledTimes(5)
    expect(run).toHaveBeenCalledTimes(4)
  })
})

describe('Non-Interactive Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Transforms code with source params provided', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    await upgrade('__testfixtures__')

    expect(spyOnConsole).toHaveBeenCalledTimes(5)
    expect(spyOnConsole).toHaveBeenCalledWith('> Applying codemod: magic-redirect')
    expect(spyOnConsole).toHaveBeenCalledWith('> Applying codemod: pluralized-methods')
    expect(spyOnConsole).toHaveBeenCalledWith('> Applying codemod: req-param')
    expect(spyOnConsole).toHaveBeenCalledWith('> Applying codemod: v4-deprecated-signatures')
    expect(spyOnConsole).toHaveBeenLastCalledWith('\n> All codemods have been applied successfully. \n')
    expect(run).toHaveBeenCalledTimes(4)
  })
})
