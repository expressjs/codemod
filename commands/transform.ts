import { join, resolve } from 'node:path'
import type { Options } from 'jscodeshift'
import { run as jscodeshift } from 'jscodeshift/src/Runner'
import { bold } from 'picocolors'
import prompts from 'prompts'
import { TRANSFORM_OPTIONS } from '../config'

export function onCancel() {
  console.info('> Cancelled process. Program will stop now without any actions. \n')
  process.exit(1)
}

const transformerDirectory = join(__dirname, '../', 'transforms')

export async function transform(codemodName?: string, source?: string, options?: Record<string, unknown>) {
  let codemodSelected = codemodName
  let sourceSelected = source

  const existCodemod = TRANSFORM_OPTIONS.find(({ value }) => value === codemodSelected)

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

  sourceSelected = resolve(sourceSelected || '')

  if (!codemodSelected) {
    console.info('> Codemod is not selected. Exist the program. \n')
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

  await jscodeshift(transformerPath, [sourceSelected || ''], args)
}
