import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string> {
  const rootNode = root.root()

  // Helper function to find the request parameter name
  function findRequestParamName(node: any): string {
    let current = node
    const funcKinds = new Set([
      'function_declaration',
      'function_expression',
      'function',
      'arrow_function',
      'method_definition',
    ])

    while (current) {
      const parent = current.parent()
      if (!parent) break

      const kind = parent?.kind()
      if (kind && funcKinds.has(kind)) {
        const candidateFields = ['parameters', 'parameter', 'formal_parameters', 'params']
        let params: any = null

        for (const f of candidateFields) {
          params = parent?.field(f)
          if (params) break
        }

        if (params) {
          const children = typeof params.children === 'function' ? params.children() : []
          if (children && children.length > 0) {
            const first = children[1]

            if (first?.kind() === 'required_parameter') {
              const pattern = first?.field('pattern')
              if (pattern && typeof pattern.kind === 'function' && pattern.kind() === 'identifier') {
                return pattern.text()
              }
            }
          }
        }
      }

      current = parent
    }

    return 'req' // default fallback
  }

  // Find all redirect and location
  const nodes = rootNode.findAll({
    rule: {
      any: [
        {
          pattern: '$OBJ.redirect($ARG)',
        },
        {
          pattern: '$OBJ.location($ARG)',
        },
      ],
    },
  })

  const edits = nodes.reduce((acc: any[], node: any) => {
    const requestParamName = findRequestParamName(node)
    const obj = node.getMatch('OBJ')
    const arg = node.getMatch('ARG')

    // Only transform when the argument is the literal 'back' (single or double quotes)
    const argText = arg && typeof arg.text === 'function' ? arg.text() : null
    if (argText !== "'back'" && argText !== '"back"' && argText !== '‘back’' && argText !== '“back”') {
      return acc // skip this node, no edit
    }

    // Case: obj.redirect('back') or obj.location('back')
    const objText = obj?.text()
    const methodName = node.text().includes('.redirect(') ? 'redirect' : 'location'
    acc.push(node.replace(`${objText}.${methodName}(${requestParamName}.get("Referrer") || "/")`))
    return acc
  }, [] as any[])

  const newSource = rootNode.commitEdits(edits)
  return newSource
}

export default transform
