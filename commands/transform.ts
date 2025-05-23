import { join, resolve } from 'node:path'
import type { Options } from 'jscodeshift'
import { run as jscodeshift } from 'jscodeshift/src/Runner'
import { bold } from 'picocolors'
import prompts from 'prompts'
import { TRANSFORM_OPTIONS } from '../config'
import { onCancel, promptSource } from '../utils/prompts'

const transformerDirectory = join(__dirname, '../', 'transforms')

const selectCodemod = async (): Promise<string> => {
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

  return res.transformer
}

export async function transform(codemodName?: string, source?: string, options?: Record<string, unknown>) {
  const existCodemod = TRANSFORM_OPTIONS.find(({ value }) => value === codemodName)
  const codemodSelected = !codemodName || (codemodName && !existCodemod) ? await selectCodemod() : codemodName

  if (!codemodSelected) {
    console.info('> Codemod is not selected. Exits the program. \n')
    process.exit(1)
  }

  const sourceSelected = source || (await promptSource('Which files or directories should the codemods be applied to?'))

  if (!sourceSelected) {
    console.info('> Source path for project is not selected. Exits the program. \n')
    process.exit(1)
  }

  const transformerPath = join(transformerDirectory, `${codemodSelected}.js`)

  const args: Options = {
    ...options,
    verbose: options?.verbose ? 2 : 0,
    babel: false,
    ignorePattern: '**/node_modules/**',
    extensions: 'cts,mts,ts,js,mjs,cjs',
  }

  await jscodeshift(transformerPath, [resolve(sourceSelected)], args)
}
