import { execSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { TRANSFORM_OPTIONS } from '../../config.js'

let output = execSync('node ../../index.js --help', {
  encoding: 'utf-8',
})

output = output.replace(
  /(?<=Usage: @expressjs\/codemod \[codemod\] \[source\] \[options\]\n\n)[\s\S]*?(?=Options:)/,
  '',
)

const readmePath = join('..', '..', 'README.md')
const readme = await readFile(readmePath, 'utf-8')

let updatedReadme = readme.replace(/(?<=<!-- USAGE START -->\n\n```\n)[\s\S]*?(?=```\n\n<!-- USAGE END -->)/, output)

const codemods = TRANSFORM_OPTIONS.map(({ value, description, version }) => {
  return `### ${value.replaceAll('-', ' ')} (v${version})

${description}

`
}).join('')

updatedReadme = updatedReadme.replace(/(?<=<!-- CODEMODS START -->\n\n)[\s\S]*?(?=<!-- CODEMODS END -->)/, codemods)

await writeFile(readmePath, updatedReadme, 'utf-8')
