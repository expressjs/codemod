import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      any: [
        { pattern: '$OBJ.$METHOD($ARG)' },
        {
          pattern: '$OBJ.$METHOD()',
        },
      ],
    },
    constraints: {
      METHOD: { regex: '^(acceptsCharset|acceptsEncoding|acceptsLanguage)$' },
    },
  })

  if (!nodes.length) return null

  const edits: Edit[] = []

  for (const call of nodes) {
    const method = call.getMatch('METHOD')
    const obj = call.getMatch('OBJ')
    if (!obj || !method) continue

    const objDef = obj.definition({ resolveExternal: false })
    if (!objDef) continue

    edits.push(method.replace(`${method.text()}s`))
  }

  if (!edits.length) return null

  return rootNode.commitEdits(edits)
}

export default transform
