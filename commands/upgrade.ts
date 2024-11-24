import { TRANSFORM_OPTIONS } from '../config'
import { join } from 'node:path'
import { getAllFiles } from '../utils/file'
import prompts from 'prompts'
import execa from 'execa'

const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')


const transformerDirectory = join(__dirname, '../', 'transforms')
export function onCancel() {
  process.exit(1)
}
export async function upgrade(source: string): Promise<void> {
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

  const files = await getAllFiles(sourceSelected)

  const args: string[] = []

  args.push('--no-babel')
  args.push('--silent')
  args.push('--ignore-pattern=**/node_modules/**')
  args.push('--extensions=cts,mts,ts,js,mjs,cjs')
  args.push( ...files.map((file) => file.toString()))


  for (const { value } of TRANSFORM_OPTIONS) {
    const transformerPath = require.resolve(`${transformerDirectory}/${value}.js`)
    const jscodeshiftProcess = execa(jscodeshiftExecutable, [...args, '--transform', transformerPath])
    
      jscodeshiftProcess.stderr?.pipe(process.stderr)
  }
}
