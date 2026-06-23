import type Json from '@codemod.com/jssg-types/src/langs/json'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

const MIME_TYPES_PACKAGE = 'mime-types'
// Version that ships with Express 5; `express.static.mime` used to bundle mime@1.
const MIME_TYPES_VERSION = '^3.0.0'
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const

type PackageJson = {
  [key: string]: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function findDependencySection(
  packageJson: PackageJson,
  packageName: string,
): (typeof DEPENDENCY_SECTIONS)[number] | null {
  for (const section of DEPENDENCY_SECTIONS) {
    const dependencies = packageJson[section]
    if (isRecord(dependencies) && Object.hasOwn(dependencies, packageName)) {
      return section
    }
  }

  return null
}

function detectIndent(source: string): string | number {
  const match = source.match(/\n([ \t]+)"/)

  return match?.[1] ?? 2
}

function detectLineEnding(source: string): string {
  return source.includes('\r\n') ? '\r\n' : '\n'
}

// Adds `mime-types` to a project's dependencies after `express.static.mime` is
// migrated away. Only Express projects are touched, the dependency is added to
// the same section as `express`, and an existing `mime-types` entry is left as is.
async function transform(root: SgRoot<Json>): Promise<string | null> {
  const rootNode = root.root()
  const source = rootNode.text()
  let packageJson: PackageJson

  try {
    packageJson = JSON.parse(source) as PackageJson
  } catch {
    return null
  }

  const expressSection = findDependencySection(packageJson, 'express')
  if (!expressSection) return null

  // Never override an existing mime-types entry (regardless of which section).
  if (findDependencySection(packageJson, MIME_TYPES_PACKAGE)) return null

  const dependencies = packageJson[expressSection]
  if (!isRecord(dependencies)) return null

  dependencies[MIME_TYPES_PACKAGE] = MIME_TYPES_VERSION

  const lineEnding = detectLineEnding(source)
  const nextSource = `${JSON.stringify(packageJson, null, detectIndent(source)).replace(/\n/g, lineEnding)}${source.endsWith('\n') ? lineEnding : ''}`
  const edits: Edit[] = [rootNode.replace(nextSource)]

  return rootNode.commitEdits(edits)
}

export default transform
