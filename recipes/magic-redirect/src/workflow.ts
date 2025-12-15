import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgNode, SgRoot } from '@codemod.com/jssg-types/src/main'

function getStringLiteralValue(node: SgNode<Js>): string | null {
  if (!node.is('string')) return null

  const fragments = node.findAll({ rule: { kind: 'string_fragment' } })
  if (fragments.length !== 1) return null
  return fragments[0]?.text() ?? null
}

function findParentFunctionParameters(node: SgNode<Js>): SgNode<Js, 'formal_parameters'> | null {
  let parent = node.parent()
  while (parent) {
    if (parent.is('formal_parameters')) return parent
    parent = parent.parent()
  }
  return null
}

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      pattern: '$OBJ.$METHOD($ARG)',
    },
    constraints: {
      METHOD: { regex: '^(redirect|location)$' },
      ARG: { pattern: { context: "'back'", strictness: 'relaxed' } },
    },
  })

  const edits: Edit[] = []

  for (const call of nodes) {
    const arg = call.getMatch('ARG')
    const obj = call.getMatch('OBJ')
    if (!arg || !obj) continue

    if (getStringLiteralValue(arg) !== 'back') continue

    const objDef = obj.definition({ resolveExternal: false })
    if (!objDef) continue

    const isParameter = objDef.node.matches({
      rule: { inside: { kind: 'formal_parameters', stopBy: 'end' } },
    })
    if (!isParameter) continue

    const parameters = findParentFunctionParameters(objDef.node)
    if (!parameters) continue

    const firstParameter = parameters.find({ rule: { kind: 'identifier' } })
    if (!firstParameter) continue

    const requestName = firstParameter.text()

    edits.push(arg.replace(`${requestName}.get("Referrer") || "/"`))
  }

  if (edits.length === 0) return null
  return rootNode.commitEdits(edits)
}

export default transform
