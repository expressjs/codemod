import { join } from 'node:path'
import execa from 'execa'
import { bold, green } from 'picocolors'
import prompts from 'prompts'
import { TRANSFORM_OPTIONS } from '../config'
import { getAllFiles } from '../utils/file'

export function onCancel() {
  process.exit(1)
}

const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')
const transformerDirectory = join(__dirname, '../', 'transforms')

// biome-ignore lint/suspicious/noExplicitAny: 'Any' is used because options can be anything.
export async function transform(codemodName: string, source: string, options: any): Promise<void> {
  let codemodSelected = codemodName
  let sourceSelected = source

  const { dry, print, verbose } = options

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

  const args: string[] = []

  if (dry) {
    args.push('--dry')
  }

  if (print) {
    args.push('--print')
  }

  if (verbose) {
    args.push('--verbose=2')
  }

  args.push('--no-babel')
  args.push('--ignore-pattern=**/node_modules/**')
  args.push('--extensions=cts,mts,ts,js,mjs,cjs')

  const files = await getAllFiles(sourceSelected)

  args.push('--transform', transformerPath, ...files.map((file) => file.toString()))

  console.log(`Executing command: ${green('jscodeshift')} ${args.join(' ')}`)

  const jscodeshiftProcess = execa(jscodeshiftExecutable, args, {
    // include ANSI color codes
    env: process.stdout.isTTY ? { FORCE_COLOR: 'true' } : {},
  })

  jscodeshiftProcess.stdout?.pipe(process.stdout)
  jscodeshiftProcess.stderr?.pipe(process.stderr)
}
