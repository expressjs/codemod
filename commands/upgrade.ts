import { join, resolve } from 'node:path'
import type { Options } from 'jscodeshift'
import { run as jscodeshift } from 'jscodeshift/src/Runner'
import prompts from 'prompts'
import { TRANSFORM_OPTIONS } from '../config'
import { onCancel, promptSource } from '../utils/prompts'

const transformerDirectory = join(__dirname, '../', 'transforms')

export async function upgrade(source?: string, options?: Record<string, unknown>) {
  const sourceSelected = source || (await promptSource('Which directory should the codemods be applied to?'))

  if (!sourceSelected) {
    console.info('> Source path for project is not selected. Exits the program. \n')
    process.exit(1)
  }
  let codemods: string[] = []

  if (options?.select) {
    const { codemodsSelected } = await prompts(
      {
        type: 'multiselect',
        name: 'codemodsSelected',
        message: `The following 'codemods' are recommended for your upgrade. Select the ones to apply.`,
        choices: TRANSFORM_OPTIONS.map(({ description, value, version }) => {
          return {
            title: `(v${version}) ${value}`,
            description,
            value,
            selected: true,
          }
        }),
      },
      { onCancel },
    )
    codemods = codemodsSelected
  } else {
    codemods = TRANSFORM_OPTIONS.map(({ value }) => value)
  }

  const args: Options = {
    dry: false,
    babel: false,
    silent: true,
    ignorePattern: '**/node_modules/**',
    extensions: 'cts,mts,ts,js,mjs,cjs',
  }

  for (const codemod of codemods) {
    const transformerPath = join(transformerDirectory, `${codemod}.js`)

    console.log(`> Applying codemod: ${codemod}`)

    try {
      await jscodeshift(transformerPath, [resolve(sourceSelected)], args)
    } catch (error) {
      console.error(`> Error applying codemod: ${codemod}`)
      console.error(error)
    }
  }

  console.log('\n> All codemods have been applied successfully. \n')
}
