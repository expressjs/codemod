import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Options } from 'jscodeshift'
import { run as jscodeshift } from 'jscodeshift/src/Runner'
import prompts from 'prompts'
import { coerce, compare } from 'semver'
import { TRANSFORM_OPTIONS } from '../config'
import { onCancel } from '../utils/share'

const transformerDirectory = join(__dirname, '../', 'transforms')

export async function upgrade(source: string | undefined) {
  let sourceSelected = source

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

  try {
    const packageJsonPath = resolve(sourceSelected || '', 'package.json')
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))

    const codemods = suggestCodemods(packageJson)

    const { codemodsSelected } = await prompts(
      {
        type: 'multiselect',
        name: 'codemodsSelected',
        message: `The following 'codemods' are recommended for your upgrade. Select the ones to apply.`,
        choices: codemods.map(({ description, value, version }) => {
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

    const args: Options = {
      dry: false,
      babel: false,
      ignorePattern: '**/node_modules/**',
      extensions: 'cts,mts,ts,js,mjs,cjs',
    }
    const results: object[] = []

    for (const codemod of codemodsSelected) {
      const transformerPath = require.resolve(`${transformerDirectory}/${codemod}.js`)
      const jscodeshiftProcess = await jscodeshift(transformerPath, [sourceSelected || ''], args)

      results.push(jscodeshiftProcess)
    }

    return results
  } catch (err) {
    console.log(err)
  }
}

function suggestCodemods(packageJson) {
  const { dependencies } = packageJson

  if (dependencies?.express == null) {
    return []
  }

  const expressVersion = coerce(dependencies.express)?.version ?? '4.0.0'

  const codemodsSuggested = TRANSFORM_OPTIONS.filter((a) => {
    return compare(a.version, expressVersion) > 0
  })

  return codemodsSuggested
}
