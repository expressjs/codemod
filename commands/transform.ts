import { writeFile } from 'node:fs/promises'
import { bold } from 'picocolors'
import prompts from 'prompts'
import { TRANSFORM_OPTIONS } from '../config'
import { getAllFiles, getContent } from '../utils/file'

export function onCancel() {
  process.exit(1)
}

// biome-ignore lint/suspicious/noExplicitAny: 'Any' is used because options can be anything.
export async function transform(codemodName: string, source: string, options: any): Promise<void> {
  let codemodSelected = codemodName
  let sourceSelected = source

  const { dry } = options

  let existCodemod = TRANSFORM_OPTIONS.find(({ value }) => value === codemodSelected)

  if (!codemodSelected || (codemodSelected && !existCodemod)) {
    const res = await prompts(
      {
        type: 'select',
        name: 'transformer',
        message: 'Which codemod would you like to apply?',
        choices: TRANSFORM_OPTIONS.map(({ description, value, version }) => {
          return {
            title: `(${bold(`v${version}`)}) ${value}`,
            description,
            value,
          }
        }),
      },
      { onCancel },
    )

    codemodSelected = res.transformer
    existCodemod = TRANSFORM_OPTIONS.find(({ value }) => value === codemodSelected)
  }

  if (!sourceSelected) {
    const res = await prompts(
      {
        type: 'text',
        name: 'path',
        message: 'Which files or directories should the codemods be applied to?',
        initial: '.',
      },
      { onCancel },
    )

    sourceSelected = res.path
  }

  const files = await getAllFiles(sourceSelected)

  for (const file of files) {
    const content = await getContent(file)

    if (existCodemod) {
      const newContent = existCodemod.codemod({ path: file.toString(), source: content }, options)

      if (!dry) {
        await writeFile(file.toString(), newContent)
      }
    }
  }
}
