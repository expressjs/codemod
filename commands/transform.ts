import { join } from 'node:path'
import type { Options } from 'jscodeshift'
import { run as jscodeshift } from 'jscodeshift/src/Runner'
import { bold } from 'picocolors'
import prompts from 'prompts'
import { TRANSFORM_OPTIONS } from '../config'

export function onCancel() {
  process.exit(1)
}

const transformerDirectory = join(__dirname, '../', 'transforms')

// biome-ignore lint/suspicious/noExplicitAny: 'Any' is used because options can be anything.
export async function transform(codemodName: string | undefined, source: string | undefined, options: any) {
  let codemodSelected = codemodName
  let sourceSelected = source

  const { dry, print, verbose, silent } = options

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
  const transformerPath = join(transformerDirectory, `${codemodSelected}.js`)

  const args: Options = {
    dry,
    silent,
    print,
    verbose: verbose ? 2 : 0,
    babel: false,
    ignorePattern: '**/node_modules/**',
    extensions: 'cts,mts,ts,js,mjs,cjs',
  }

  const jscodeshiftProcess = await jscodeshift(transformerPath, [sourceSelected || ''], args)

  return jscodeshiftProcess
}
