import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      pattern: '$OBJ.$METHOD($$$METHOD)',
    },
    constraints: {
      METHOD: { regex: '^(sendfile)$' },
    },
  })

  const edits: Edit[] = []

  for (const call of nodes) {
    const method = call.getMatch('METHOD')
    const obj = call.getMatch('OBJ')
    if (!method || !obj) continue

    const objDef = obj.definition({ resolveExternal: false })
    if (!objDef) continue

    edits.push(method.replace('sendFile'))
  }

  if (edits.length === 0) return null
  return rootNode.commitEdits(edits)
}

export default transform
