import { run } from 'jscodeshift/src/Runner'
import { upgrade } from '../upgrade'

jest.mock('jscodeshift/src/Runner', () => ({
  run: jest.fn(),
}))

describe('interactive mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.todo('runs without source params provided and select is true')
})

describe('Non-Interactive Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Transforms code with source params provided', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()

    await upgrade('__testfixtures__')

    expect(spyOnConsole).toHaveBeenCalled()
    expect(run).toHaveBeenCalledTimes(4)
  })
})
