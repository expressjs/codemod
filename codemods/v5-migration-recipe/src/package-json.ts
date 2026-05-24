import type Json from '@codemod.com/jssg-types/src/langs/json'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

const PACKAGE_UPDATES = {
  '@types/express': '^5.0.0',
  '@types/express-serve-static-core': '^5.0.0',
  '@types/serve-static': '^2.2.0',
  accepts: '^2.0.0',
  'body-parser': '^2.2.1',
  'content-disposition': '^1.0.0',
  'content-type': '^1.0.5',
  cookie: '^0.7.1',
  'cookie-signature': '^1.2.1',
  debug: '^4.4.0',
  depd: '^2.0.0',
  encodeurl: '^2.0.0',
  'escape-html': '^1.0.3',
  etag: '^1.8.1',
  express: '^5.0.0',
  finalhandler: '^2.1.0',
  fresh: '^2.0.0',
  'http-errors': '^2.0.0',
  'merge-descriptors': '^2.0.0',
  'mime-types': '^3.0.0',
  'on-finished': '^2.4.1',
  once: '^1.4.0',
  parseurl: '^1.3.3',
  'proxy-addr': '^2.0.7',
  qs: '^6.14.0',
  'range-parser': '^1.2.1',
  router: '^2.2.0',
  send: '^1.1.0',
  'serve-static': '^2.2.0',
  statuses: '^2.0.1',
  'type-is': '^2.0.1',
  vary: '^1.1.2',
} as const
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const

type PackageJson = {
  [key: string]: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function updateDependency(dependencies: unknown, packageName: string, version: string): boolean {
  if (!isRecord(dependencies)) {
    return false
  }

  if (Object.hasOwn(dependencies, packageName) && dependencies[packageName] !== version) {
    dependencies[packageName] = version
    return true
  }

  return false
}

function detectIndent(source: string): string | number {
  const match = source.match(/\n([ \t]+)"/)

  return match?.[1] ?? 2
}

function detectLineEnding(source: string): string {
  return source.includes('\r\n') ? '\r\n' : '\n'
}

async function transform(root: SgRoot<Json>): Promise<string | null> {
  const rootNode = root.root()
  const source = rootNode.text()
  let packageJson: PackageJson

  try {
    packageJson = JSON.parse(source) as PackageJson
  } catch {
    return null
  }

  let changed = false

  for (const section of DEPENDENCY_SECTIONS) {
    const dependencies = packageJson[section]

    for (const [packageName, version] of Object.entries(PACKAGE_UPDATES)) {
      changed = updateDependency(dependencies, packageName, version) || changed
    }
  }

  if (!changed) {
    return null
  }

  const lineEnding = detectLineEnding(source)
  const nextSource = `${JSON.stringify(packageJson, null, detectIndent(source)).replace(/\n/g, lineEnding)}${source.endsWith('\n') ? lineEnding : ''}`
  const edits: Edit[] = [rootNode.replace(nextSource)]

  return rootNode.commitEdits(edits)
}

export default transform
