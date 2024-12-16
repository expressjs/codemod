import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Options } from 'jscodeshift'
import { run as jscodeshift } from 'jscodeshift/src/Runner'
import prompts from 'prompts'
import { coerce, compare } from 'semver'
import { TRANSFORM_OPTIONS } from '../config'
import { onCancel, promptSource } from '../utils/share'

const transformerDirectory = join(__dirname, '../', 'transforms')

export async function upgrade(source?: string) {
  const sourceSelected = source || (await promptSource('Which directory should the codemods be applied to?'))

  if (!sourceSelected) {
    console.info('> Source path for project is not selected. Exits the program. \n')
    process.exit(1)
  }

  let packageJson = ''

  try {
    const packageJsonPath = resolve(sourceSelected || '', 'package.json')
    packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.info('> No package.json found in the selected directory. \n')
      process.exit(1)
    } else {
      console.error(err.message)
    }
  }

  const codemods = suggestCodemods(packageJson)

  if (codemods.length === 0) {
    console.info('> No codemods are suggested for this project. \n')

    return
  }

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
    silent: true,
    ignorePattern: '**/node_modules/**',
    extensions: 'cts,mts,ts,js,mjs,cjs',
  }

  const results = {
    ok: 0,
    skipped: 0,
    failed: 0,
    unmodified: 0,
  }

  for (const codemod of codemodsSelected) {
    const transformerPath = require.resolve(`${transformerDirectory}/${codemod}.js`)

    console.log(`> Applying codemod: ${codemod}`)
    const { ok, skip, error, nochange } = await jscodeshift(transformerPath, [resolve(sourceSelected)], args)

    results.ok += ok
    results.skipped += skip
    results.failed += error
    results.unmodified += nochange
  }

  console.log('\n> Summary of the upgrade')
  console.log(`> ${results.ok} codemods were applied successfully`)
  console.log(`> ${results.skipped} codemods were skipped`)
  console.log(`> ${results.failed} codemods failed`)
  console.log(`> ${results.unmodified} codemods were skipped because they didn't change anything`)
}

function suggestCodemods(packageJson) {
  const { dependencies } = packageJson

  if (dependencies?.express == null) {
    console.info('> No express dependency found in package.json. \n')

    process.exit(0)
  }

  const expressVersion = coerce(dependencies.express)?.version ?? '4.0.0'

  const codemodsSuggested = TRANSFORM_OPTIONS.filter((a) => {
    return compare(a.version, expressVersion) > 0
  })

  return codemodsSuggested
}
