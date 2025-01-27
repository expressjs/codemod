import prompts from 'prompts'

export function onCancel() {
  console.info('> Cancelled process. Program will stop now without any actions. \n')
  process.exit(1)
}

export const promptSource = async (message: string): Promise<string> => {
  const res = await prompts(
    {
      type: 'text',
      name: 'path',
      message,
      initial: '.',
    },
    { onCancel },
  )

  return res.path
}
