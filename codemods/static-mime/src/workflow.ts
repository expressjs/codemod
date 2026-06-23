import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgNode, SgRoot } from '@codemod.com/jssg-types/src/main'

const MIME_TYPES_MODULE = 'mime-types'
// Candidate local names tried in order when introducing a new `mime-types`
// binding, skipping any that are already declared in the file.
const NAME_CANDIDATES = ['mime', 'mimeTypes', 'mimeTypesLib']

// Migrates `express.static.mime` (removed in Express 5) to the `mime-types`
// package, e.g. `express.static.mime.lookup('json')` -> `mime.lookup('json')`
// plus an added `import mime from 'mime-types'` / `const mime = require('mime-types')`.
async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: { pattern: '$EXPRESS.static.mime' },
  })

  if (!nodes.length) return null

  // Only the occurrences whose `express` actually resolves to the express module.
  const matches: { node: SgNode<Js>; express: SgNode<Js> }[] = []
  for (const node of nodes) {
    const express = node.getMatch('EXPRESS')
    if (!express) continue
    if (!isExpressBinding(express)) continue
    matches.push({ node, express })
  }

  if (!matches.length) return null

  // Reuse an existing `mime-types` import if the file already has one;
  // otherwise pick a non-colliding local name and remember to add the import.
  const existingName = findExistingMimeTypesName(rootNode)
  const localName = existingName ?? pickLocalName(rootNode)

  const edits: Edit[] = []
  for (const { node } of matches) {
    const { node: target, replacement } = classifyUsage(node, localName)
    edits.push(target.replace(replacement))
  }

  if (!existingName) {
    const importEdit = buildImportEdit(rootNode, matches[0].express, localName)
    if (importEdit) edits.push(importEdit)
  }

  return rootNode.commitEdits(edits)
}

interface Usage {
  // The outermost node to rewrite for this `express.static.mime` occurrence.
  node: SgNode<Js>
  replacement: string
}

// The mime@1.x instance Express 4 exposed as `express.static.mime` is not
// API-compatible with `mime-types`. Besides the shared methods (`lookup`,
// `extension`, `types`, `extensions`) handled by the plain rename, two cases
// need extra work:
//   - `mime.charsets.lookup(type)` becomes `mime.charset(type)`.
//   - `define`, `load`, and `default_type` have no `mime-types` equivalent, so
//     they are flagged inline for manual migration instead of silently breaking.
function classifyUsage(mimeNode: SgNode<Js>, localName: string): Usage {
  const access = mimeNode.parent()
  const property = getPropertyName(access)

  if (property === 'charsets') {
    // `express.static.mime.charsets.lookup(type)` -> `mime.charset(type)`
    const lookupAccess = access?.parent()
    if (getPropertyName(lookupAccess) === 'lookup') {
      const call = lookupAccess?.parent()
      const args = call?.is('call_expression') ? call.field('arguments') : null
      if (call && args) {
        return { node: call, replacement: `${localName}.charset${args.text()}` }
      }
    }

    return flag(
      access ?? mimeNode,
      `${localName}.charset`,
      "'mime-types' has no charsets.lookup(); use charset() and migrate manually",
    )
  }

  if (property === 'define' || property === 'load') {
    const call = access?.parent()
    if (call?.is('call_expression')) {
      const rewritten = call.text().replace(mimeNode.text(), localName)
      return flag(call, rewritten, `'mime-types' has no ${property}(); migrate manually`)
    }
  }

  if (property === 'default_type' && access) {
    return flag(access, `${localName}.default_type`, "'mime-types' has no default_type; migrate manually")
  }

  return { node: mimeNode, replacement: localName }
}

function flag(node: SgNode<Js>, code: string, message: string): Usage {
  return { node, replacement: `${code} /* TODO: ${message} */` }
}

// Returns the property name of a `member_expression` (e.g. `charsets` for
// `express.static.mime.charsets`), or null for any other node.
function getPropertyName(node: SgNode<Js> | null | undefined): string | null {
  if (!node?.is('member_expression')) return null

  const property = node.field('property')
  return property ? property.text() : null
}

// Builds the edit that introduces the `mime-types` binding. The statement style
// (ESM `import` vs CommonJS `require`) and insertion point follow how `express`
// itself is brought in; an inline `require("express")` falls back to prepending
// the require at the top of the file.
function buildImportEdit(rootNode: SgNode<Js>, express: SgNode<Js>, localName: string): Edit | null {
  const anchor = resolveImportAnchor(express)

  if (anchor?.kind === 'esm') {
    const statement = `import ${localName} from '${MIME_TYPES_MODULE}';`
    return anchor.node.replace(`${anchor.node.text()}\n${statement}`)
  }

  const statement = `const ${localName} = require('${MIME_TYPES_MODULE}');`

  if (anchor) {
    return anchor.node.replace(`${anchor.node.text()}\n${statement}`)
  }

  // No statement to anchor to (e.g. inline `require("express").static.mime`):
  // prepend the require before the first top-level statement.
  const firstStatement = rootNode.children().find((child) => !child.is('comment'))
  if (!firstStatement) return null

  return firstStatement.replace(`${statement}\n\n${firstStatement.text()}`)
}

interface ImportAnchor {
  // The statement after which (esm/cjs) the new binding is inserted.
  node: SgNode<Js>
  kind: 'esm' | 'cjs'
}

function resolveImportAnchor(express: SgNode<Js>): ImportAnchor | null {
  // Inline `require("express")`: no binding statement to anchor to.
  if (express.is('call_expression')) return null

  const definition = express.definition({ resolveExternal: false })
  if (!definition) return null

  const importStatement = findAncestorOrSelf(definition.node, 'import_statement')
  if (importStatement) return { node: importStatement, kind: 'esm' }

  const lexical = findAncestorOrSelf(definition.node, 'lexical_declaration')
  if (lexical) return { node: lexical, kind: 'cjs' }

  const variable = findAncestorOrSelf(definition.node, 'variable_declaration')
  if (variable) return { node: variable, kind: 'cjs' }

  return null
}

// Returns the local name of an existing `mime-types` import (ESM default,
// namespace, or CommonJS require), or null when the file has none.
function findExistingMimeTypesName(rootNode: SgNode<Js>): string | null {
  for (const importStatement of rootNode.findAll({ rule: { kind: 'import_statement' } })) {
    if (getStringLiteralValue(importStatement.field('source')) !== MIME_TYPES_MODULE) continue

    const clause = importStatement.children().find((child) => child.is('import_clause'))
    if (!clause) continue

    const defaultImport = clause.children().find((child) => child.is('identifier'))
    if (defaultImport) return defaultImport.text()

    const namespace = clause.children().find((child) => child.is('namespace_import'))
    const namespaceName = namespace?.children().find((child) => child.is('identifier'))
    if (namespaceName) return namespaceName.text()
  }

  for (const declarator of rootNode.findAll({ rule: { kind: 'variable_declarator' } })) {
    const value = declarator.field('value')
    if (!value?.is('call_expression') || !isRequireCall(value, MIME_TYPES_MODULE)) continue

    const name = declarator.field('name')
    if (name?.is('identifier')) return name.text()
  }

  return null
}

function pickLocalName(rootNode: SgNode<Js>): string {
  const declared = collectDeclaredNames(rootNode)

  for (const candidate of NAME_CANDIDATES) {
    if (!declared.has(candidate)) return candidate
  }

  // Extremely unlikely fallback: derive a numbered name that is still free.
  let suffix = 2
  while (declared.has(`mimeTypes${suffix}`)) suffix++
  return `mimeTypes${suffix}`
}

// Gathers identifiers introduced by declarations so a freshly added `mime-types`
// binding never shadows or collides with an existing name.
function collectDeclaredNames(rootNode: SgNode<Js>): Set<string> {
  const names = new Set<string>()

  for (const declarator of rootNode.findAll({ rule: { kind: 'variable_declarator' } })) {
    const name = declarator.field('name')
    if (name?.is('identifier')) names.add(name.text())
  }

  for (const kind of ['function_declaration', 'generator_function_declaration', 'class_declaration']) {
    for (const decl of rootNode.findAll({ rule: { kind } })) {
      const name = decl.field('name')
      if (name?.is('identifier')) names.add(name.text())
    }
  }

  for (const importStatement of rootNode.findAll({ rule: { kind: 'import_statement' } })) {
    const clause = importStatement.children().find((child) => child.is('import_clause'))
    if (!clause) continue
    // Conservatively treat every identifier in the import clause as taken.
    for (const identifier of clause.findAll({ rule: { kind: 'identifier' } })) {
      names.add(identifier.text())
    }
  }

  return names
}

function isRequireCall(node: SgNode<Js>, moduleName: string): boolean {
  const callFunction = node.field('function')
  if (!callFunction?.is('identifier') || callFunction.text() !== 'require') return false

  const args = node.field('arguments')
  if (!args) return false

  const source = args.children().find((child) => child.is('string'))
  return getStringLiteralValue(source) === moduleName
}

function isExpressBinding(binding: SgNode<Js>): boolean {
  if (binding.is('call_expression')) {
    return isRequireCall(binding, 'express')
  }

  const definition = binding.definition({ resolveExternal: false })
  if (!definition) return false

  return isExpressDefinition(definition.node)
}

function isExpressDefinition(node: SgNode<Js>): boolean {
  const importStatement = findAncestorOrSelf(node, 'import_statement')
  if (importStatement) {
    return getStringLiteralValue(importStatement.field('source')) === 'express'
  }

  const declarator = findAncestorOrSelf(node, 'variable_declarator')
  if (declarator) {
    const value = declarator.field('value')
    return !!value?.is('call_expression') && isRequireCall(value, 'express')
  }

  return false
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

function getStringLiteralValue(node: SgNode<Js> | null | undefined): string | null {
  if (!node || !node.is('string')) return null

  const text = node.text()
  if (text.length < 2) return null

  return text.slice(1, -1)
}

export default transform
