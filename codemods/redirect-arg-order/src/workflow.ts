import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      pattern: '$OBJ.$METHOD($$$ARG)',
    },
    constraints: {
      METHOD: { regex: '^(redirect)$' },
    },
  })

  if (!nodes.length) return null

  const edits: Edit[] = []

  for (const call of nodes) {
    const obj = call.getMatch('OBJ')
    const args = call.getMultipleMatches('ARG')
    if (!obj || args.length < 3) continue

    const objDef = obj.definition({ resolveExternal: false })
    if (!objDef) continue

    // $$$ARG yields argument nodes interleaved with separators, so arg nodes are at 0,2,4...
    const first = args[0]
    const second = args[2]
    if (!first || !second) continue

    // Only transform legacy form redirect(url, status) where second is number
    if (second.is('number') && !first.is('number')) {
      edits.push(call.replace(`${obj.text()}.redirect(${second.text()}, ${first.text()})`))
    }
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
}

export default transform
