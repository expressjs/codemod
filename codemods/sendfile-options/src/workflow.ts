import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgNode, SgRoot } from '@codemod.com/jssg-types/src/main'

const DOTFILES_OPTION = "dotfiles: 'allow' /* Express 5: preserve v4 behavior */"

// Migrates `res.sendFile()` options to Express 5: adds an explicit `dotfiles`
// option to preserve the Express 4 behavior (v4 served hidden directories in the
// path by default, v5 returns 404), and renames the removed `hidden` and `from`
// options to `dotfiles` and `root`.
//
// `res.sendFile(path[, options][, callback])` makes the argument handling more
// involved than `express.static()`: when no options object is present, one is
// inserted before any trailing callback.
async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()
  const edits: Edit[] = []

  const calls = rootNode.findAll({
    rule: {
      any: [
        { pattern: '$RES.sendFile($PATH)' },
        { pattern: '$RES.sendFile($PATH, $SECOND)' },
        { pattern: '$RES.sendFile($PATH, $SECOND, $THIRD)' },
      ],
    },
  })

  if (!calls.length) return null

  for (const call of calls) {
    const target = call.getMatch('RES')
    const pathArg = call.getMatch('PATH')
    if (!target || !pathArg) continue

    // Only rewrite calls on a response object, i.e. a function parameter such as
    // the `res` in `(req, res) => res.sendFile(...)`. This avoids touching
    // unrelated `.sendFile()` calls on objects we can't identify as Express.
    if (!isResponseBinding(target)) continue

    const second = call.getMatch('SECOND')

    if (!second) {
      // `res.sendFile(path)` -> add an options object.
      edits.push(call.replace(`${target.text()}.sendFile(${pathArg.text()}, { ${DOTFILES_OPTION} })`))
      continue
    }

    if (second.is('object')) {
      // `res.sendFile(path, { ... }[, cb])` -> rewrite the options object.
      const result = transformOptions(second)
      if (!result) continue

      let newOpts = result.text
      if (!result.hasDotfiles) {
        newOpts = addDotfilesOption(newOpts)
      }

      const originalOpts = second.text()
      if (newOpts === originalOpts) continue

      edits.push(call.replace(call.text().replace(originalOpts, newOpts)))
      continue
    }

    // `res.sendFile(path, callback)` -> insert the options object before the
    // callback. Anything else as the second argument (e.g. a variable we can't
    // see into) is left untouched.
    const third = call.getMatch('THIRD')
    if (!third && isCallback(second)) {
      edits.push(call.replace(`${target.text()}.sendFile(${pathArg.text()}, { ${DOTFILES_OPTION} }, ${second.text()})`))
    }
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

function isCallback(node: SgNode<Js>): boolean {
  return node.is('arrow_function') || node.is('function_expression')
}

function isResponseBinding(binding: SgNode<Js>): boolean {
  const definition = binding.definition({ resolveExternal: false })
  if (!definition) return false

  return definition.node.matches({
    rule: { inside: { kind: 'formal_parameters', stopBy: 'end' } },
  })
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
