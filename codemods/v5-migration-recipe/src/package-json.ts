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

function parseVersion(range: string): [number, number, number] | null {
  // Range operators (^, ~, >=, ...) are ignored and missing parts default to 0,
  // so `>=4` parses as 4.0.0. Unparseable ranges such as `*`, `x`, `workspace:*`
  // or `latest` yield null and are left untouched.
  const match = range.match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/)
  if (!match) return null

  return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)]
}

function isGreater(a: [number, number, number], b: [number, number, number]): boolean {
  for (let index = 0; index < 3; index++) {
    if (a[index] !== b[index]) return a[index] > b[index]
  }

  return false
}

function updateDependency(dependencies: unknown, packageName: string, version: string): boolean {
  if (!isRecord(dependencies)) {
    return false
  }

  const current = dependencies[packageName]
  if (typeof current !== 'string' || current === version) {
    return false
  }

  // Never downgrade: skip when the declared version is already newer than the
  // Express 5 target, so re-running the recipe is idempotent and projects ahead
  // of 5.2.1 keep their versions. Equal versions are still normalized to the
  // target range (e.g. `~2.0.0` -> `^2.0.0`).
  const existing = parseVersion(current)
  const target = parseVersion(version)
  if (!existing || !target || isGreater(existing, target)) {
    return false
  }

  dependencies[packageName] = version
  return true
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
