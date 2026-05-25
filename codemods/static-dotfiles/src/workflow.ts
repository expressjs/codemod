import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgNode, SgRoot } from '@codemod.com/jssg-types/src/main'

const DOTFILES_OPTION = "dotfiles: 'allow' /* Express 5: preserve v4 behavior */"

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

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

    if (!isExpressBinding(target)) continue

    if (optsArg) {
      const optsText = optsArg.text()
      if (optsText.includes('dotfiles')) {
        continue
      }

      const newOpts = addDotfilesOption(optsText)
      edits.push(call.replace(call.text().replace(optsText, newOpts)))
    } else {
      edits.push(call.replace(`${target.text()}.static(${pathArg.text()}, { ${DOTFILES_OPTION} })`))
    }
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
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
    if (current.is(kind)) return current
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
