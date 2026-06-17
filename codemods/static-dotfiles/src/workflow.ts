import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgNode, SgRoot } from '@codemod.com/jssg-types/src/main'

const DOTFILES_OPTION = "dotfiles: 'allow' /* Express 5: preserve v4 behavior */"

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()
  const edits: Edit[] = []

  const nodes = rootNode.findAll({
    rule: {
      any: [{ pattern: '$CALL.static($PATH)' }, { pattern: '$CALL.static($PATH, $OPTS)' }],
    },
  })

  if (!nodes.length) return null

  for (const call of nodes) {
    const target = call.getMatch('CALL')
    const pathArg = call.getMatch('PATH')
    const optsArg = call.getMatch('OPTS')

    if (!target || !pathArg) continue

    if (!isExpressBinding(target)) continue

    if (!optsArg) {
      edits.push(call.replace(`${target.text()}.static(${pathArg.text()}, { ${DOTFILES_OPTION} })`))
      continue
    }

    const result = transformOptions(optsArg)
    // Skip anything that isn't an object literal (e.g. a variable reference);
    // we can't safely rewrite options we can't see.
    if (!result) continue

    let newOpts = result.text
    if (!result.hasDotfiles) {
      newOpts = addDotfilesOption(newOpts)
    }

    const originalOpts = optsArg.text()
    if (newOpts === originalOpts) continue

    edits.push(call.replace(call.text().replace(originalOpts, newOpts)))
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
}

interface TransformedOptions {
  text: string
  // True when the resulting object already carries a `dotfiles` key (either
  // present originally or produced by renaming a removed `hidden` option), so
  // the default `dotfiles: 'allow'` should NOT be appended.
  hasDotfiles: boolean
}

// Rewrites the options object for Express 5:
// - renames the removed `hidden` option to `dotfiles` (true -> 'allow', false -> 'ignore')
// - renames the removed `from` option to `root`
// Returns null when the argument isn't an object literal.
function transformOptions(optsArg: SgNode<Js>): TransformedOptions | null {
  if (!optsArg.is('object')) return null

  const edits: Edit[] = []
  const pairs = optsArg.children().filter((pair: SgNode<Js>) => pair.is('pair'))

  // An explicit `dotfiles` key always wins: we never append a default and never
  // rename a `hidden` onto it (which would produce a duplicate `dotfiles` key).
  const hasExplicitDotfiles = pairs.some((pair) => getOptionKeyName(pair) === 'dotfiles')

  // A present `hidden` (even non-literal) maps onto `dotfiles`, so a default
  // must not be appended even when we can't rewrite its value.
  let hasDotfiles = hasExplicitDotfiles

  for (const pair of pairs) {
    const keyName = getOptionKeyName(pair)

    if (keyName === 'hidden') {
      hasDotfiles = true

      if (hasExplicitDotfiles) continue

      const valueNode = pair.field('value')
      const mapped = valueNode ? mapHiddenValue(valueNode.text()) : null
      if (mapped) edits.push(pair.replace(`dotfiles: ${mapped}`))
      continue
    }

    if (keyName === 'from') {
      const keyNode = pair.field('key')
      if (keyNode) edits.push(keyNode.replace('root'))
    }
  }

  const text = edits.length ? optsArg.commitEdits(edits) : optsArg.text()
  return { text, hasDotfiles }
}

function getOptionKeyName(pair: SgNode<Js>): string | null {
  const keyNode = pair.field('key')
  if (!keyNode) return null

  return keyNode.is('string') ? getStringLiteralValue(keyNode) : keyNode.text()
}

function mapHiddenValue(valueText: string): string | null {
  const trimmed = valueText.trim()
  if (trimmed === 'true') return "'allow'"
  if (trimmed === 'false') return "'ignore'"

  return null
}

function getStringLiteralValue(node: SgNode<Js> | null | undefined): string | null {
  if (!node || !node.is('string')) return null

  const text = node.text()
  if (text.length < 2) return null

  return text.slice(1, -1)
}

function addDotfilesOption(optsText: string): string {
  const trimmed = optsText.trimEnd()

  if (!trimmed.includes('\n')) {
    const inner = trimmed.slice(1, -1).trim()

    return inner ? `{ ${inner}, ${DOTFILES_OPTION} }` : `{ ${DOTFILES_OPTION} }`
  }

  const closingBraceIndex = trimmed.lastIndexOf('}')
  const body = trimmed.slice(0, closingBraceIndex).trimEnd()
  const closingIndent = getIndentAfterLastNewline(trimmed)
  const propertyIndent = getIndentAfterLastNewline(body) || '  '

  return `${body}\n${propertyIndent}${DOTFILES_OPTION}\n${closingIndent}}`
}

function isExpressBinding(binding: SgNode<Js>): boolean {
  if (binding.is('call_expression')) {
    return isExpressRequireCall(binding)
  }

  const definition = binding.definition({ resolveExternal: false })
  if (!definition) return false

  return isExpressDefinition(definition.node)
}

function isExpressDefinition(node: SgNode<Js>): boolean {
  const importStatement = findAncestorOrSelf(node, 'import_statement')
  if (importStatement) {
    return isExpressImport(importStatement)
  }

  const declarator = findAncestorOrSelf(node, 'variable_declarator')
  if (declarator) {
    return isExpressRequireDeclarator(declarator)
  }

  return false
}

function isExpressImport(importStatement: SgNode<Js>): boolean {
  const source = importStatement.field('source')
  return getStringLiteralValue(source) === 'express'
}

function isExpressRequireDeclarator(declarator: SgNode<Js>): boolean {
  if (!declarator.is('variable_declarator')) return false

  const value = declarator.field('value')
  if (!value?.is('call_expression')) return false

  return isExpressRequireCall(value)
}

function isExpressRequireCall(node: SgNode<Js>): boolean {
  const callFunction = node.field('function')
  if (!callFunction?.is('identifier') || callFunction.text() !== 'require') return false

  const args = node.field('arguments')
  if (!args) return false

  const expressSource = args.children().find((child) => child.is('string'))
  return getStringLiteralValue(expressSource) === 'express'
}

function findAncestorOrSelf(node: SgNode<Js>, kind: string): SgNode<Js> | null {
  let current: SgNode<Js> | null = node

  while (current) {
    // Assign to a typed boolean so `is()`'s type predicate doesn't narrow
    // `current` to `never` on the following line.
    const matches: boolean = current.is(kind)
    if (matches) return current

    current = current.parent()
  }

  return null
}

function getIndentAfterLastNewline(text: string): string {
  const newlineIndex = text.lastIndexOf('\n')
  if (newlineIndex === -1) return ''

  let indent = ''
  for (let index = newlineIndex + 1; index < text.length; index++) {
    const char = text[index]
    if (char !== ' ' && char !== '\t') break
    indent += char
  }

  return indent
}

export default transform
