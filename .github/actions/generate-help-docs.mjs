import { execSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

let output = execSync('node ../../index.js --help', {
  encoding: 'utf-8',
})

output = output.replace(
  /(?<=Usage: @expressjs\/codemod \[codemod\] \[source\] \[options\]\n\n)[\s\S]*?(?=Options:)/,
  '',
)

const readmePath = join('..', '..', 'README.md')
const readme = await readFile(readmePath, 'utf-8')

const updatedReadme = readme.replace(
  /(?<=<!-- GENERATED START -->\n\n```\n)[\s\S]*?(?=```\n\n<!-- GENERATED END -->)/,
  output,
)

await writeFile(readmePath, updatedReadme, 'utf-8')
