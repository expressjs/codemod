import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      any: [
        { pattern: 'express.static($PATH)' },
        { pattern: 'express.static($PATH, $OPTS)' },
      ],
    },
  })

  if (!nodes.length) return null

  const edits: Edit[] = []

  for (const call of nodes) {
    const pathArg = call.getMatch('PATH')
    const optsArg = call.getMatch('OPTS')

    if (!pathArg) continue

    if (optsArg) {
      const optsText = optsArg.text()
      if (optsText.includes('dotfiles')) {
        continue
      }

      if (optsText.startsWith('{') && optsText.endsWith('}')) {
        const inner = optsText.slice(1, -1).trim()
        const newOpts = inner
          ? `{ ${inner}, dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }`
          : `{ dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }`
        edits.push(call.replace(`express.static(${pathArg.text()}, ${newOpts})`))
      }
    } else {
      edits.push(
        call.replace(
          `express.static(${pathArg.text()}, { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ })`
        )
      )
    }
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
}

export default transform
