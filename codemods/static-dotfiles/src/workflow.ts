import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

const DOTFILES_OPTION = "dotfiles: 'allow' /* Express 5: preserve v4 behavior */"

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()
  const expressBindings = collectExpressBindings(rootNode.text())

  const nodes = rootNode.findAll({
    rule: {
      any: [{ pattern: '$CALL.static($PATH)' }, { pattern: '$CALL.static($PATH, $OPTS)' }],
    },
  })

  if (!nodes.length) return null

  const edits: Edit[] = []

  for (const call of nodes) {
    const target = call.getMatch('CALL')
    const pathArg = call.getMatch('PATH')
    const optsArg = call.getMatch('OPTS')

    if (!target || !pathArg) continue

    const targetText = target.text()
    if (!isExpressBinding(targetText, expressBindings)) continue

    if (optsArg) {
      const optsText = optsArg.text()
      if (optsText.includes('dotfiles')) {
        continue
      }

      const newOpts = addDotfilesOption(optsText)
      edits.push(call.replace(call.text().replace(optsText, newOpts)))
    } else {
      edits.push(call.replace(`${targetText}.static(${pathArg.text()}, { ${DOTFILES_OPTION} })`))
    }
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
}

function collectExpressBindings(source: string): Set<string> {
  const bindings = new Set<string>(['express'])

  const defaultImportPattern = /import\s+([A-Za-z_$][\w$]*)(?:\s*,[\s\S]*?)?\s+from\s+['"]express['"]/g
  const namespaceImportPattern = /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]express['"]/g
  const defaultAsImportPattern = /import\s+\{\s*default\s+as\s+([A-Za-z_$][\w$]*)[\s\S]*?\}\s+from\s+['"]express['"]/g
  const requirePattern = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\s*\(\s*['"]express['"]\s*\)/g

  const patterns = [defaultImportPattern, namespaceImportPattern, defaultAsImportPattern, requirePattern]

  for (const pattern of patterns) {
    let match = pattern.exec(source)
    while (match !== null) {
      bindings.add(match[1])
      match = pattern.exec(source)
    }
  }

  return bindings
}

function addDotfilesOption(optsText: string): string {
  const trimmed = optsText.trimEnd()

  if (!trimmed.includes('\n')) {
    const inner = trimmed.slice(1, -1).trim()

    return inner ? `{ ${inner}, ${DOTFILES_OPTION} }` : `{ ${DOTFILES_OPTION} }`
  }

  const closingBraceIndex = trimmed.lastIndexOf('}')
  const body = trimmed.slice(0, closingBraceIndex).replace(/\s*$/, '')
  const closingIndentMatch = trimmed.match(/\n([ \t]*)\}$/)
  const closingIndent = closingIndentMatch?.[1] ?? ''
  const propertyIndentMatch = body.match(/\n([ \t]*)[^\n]*$/)
  const propertyIndent = propertyIndentMatch?.[1] ?? '  '

  return `${body}\n${propertyIndent}${DOTFILES_OPTION}\n${closingIndent}}`
}

function isExpressBinding(binding: string, expressBindings: Set<string>): boolean {
  return expressBindings.has(binding) || /^require\(\s*['"]express['"]\s*\)$/.test(binding)
}

export default transform
