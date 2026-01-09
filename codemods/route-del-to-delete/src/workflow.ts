import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      pattern: '$OBJ.$METHOD($$$ARG)',
    },
    constraints: {
      METHOD: { regex: '^(del)$' },
    },
  })

  if (!nodes.length) return null

  const edits: Edit[] = []

  for (const call of nodes) {
    const method = call.getMatch('METHOD')
    const args = call.getMultipleMatches('ARG')
    if (!method) continue

    // $$$ARG yields argument nodes interleaved with separators, so arg nodes are at 0,2,4...
    const first = args[0]
    if (!first) continue

    const isString = first.is('string')
    const isRegexp = first.is('regexp') || first.is('regex') || first.is('regular_expression')
    const isArray = first.is('array') || first.is('array_expression')

    if (!isString && !isRegexp && !isArray) continue

    edits.push(method.replace('delete'))
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
}

export default transform
