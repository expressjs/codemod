import type Js from '@codemod.com/jssg-types/src/langs/javascript'
import type { Edit, SgRoot } from '@codemod.com/jssg-types/src/main'

async function transform(root: SgRoot<Js>): Promise<string | null> {
  const rootNode = root.root()

  const nodes = rootNode.findAll({
    rule: {
      pattern: '$OBJ.$METHOD($$$ARG)',
    },
    constraints: {
      METHOD: { regex: '^(send|json|jsonp)$' },
    },
  })

  const edits: Edit[] = []

  for (const call of nodes) {
    const obj = call.getMatch('OBJ')
    const args = call.getMultipleMatches('ARG')

    if (args.length === 0 || !obj) continue

    const objDef = obj.definition({ resolveExternal: false })
    if (!objDef) continue

    const method = call.getMatch('METHOD')?.text()
    if (!method) continue

    // Single-argument forms: res.send(status) -> res.sendStatus(status)
    if (args.length === 1) {
      const a0 = args[0]
      if (method === 'send' && a0.is('number')) {
        edits.push(call.replace(`${obj.text()}.sendStatus(${a0.text()})`))
      }
      continue
    }

    // Two-argument forms: res.send(obj, status) -> res.status(status).send(obj)
    if (args.length >= 2) {
      const first = args[0]
      const second = args[2]

      if (!second) continue

      // support both orders: (obj, status) and (status, obj)
      if (first.is('number') && !second.is('number')) {
        const status = first
        const body = second
        if (method === 'send') {
          edits.push(call.replace(`${obj.text()}.status(${status.text()}).send(${body.text()})`))
        } else if (method === 'json') {
          edits.push(call.replace(`${obj.text()}.status(${status.text()}).json(${body.text()})`))
        } else if (method === 'jsonp') {
          edits.push(call.replace(`${obj.text()}.status(${status.text()}).jsonp(${body.text()})`))
        }
      } else if (second.is('number') && !first.is('number')) {
        const status = second
        const body = first
        if (method === 'send') {
          edits.push(call.replace(`${obj.text()}.status(${status.text()}).send(${body.text()})`))
        } else if (method === 'json') {
          edits.push(call.replace(`${obj.text()}.status(${status.text()}).json(${body.text()})`))
        } else if (method === 'jsonp') {
          edits.push(call.replace(`${obj.text()}.status(${status.text()}).jsonp(${body.text()})`))
        }
      }
    }
  }

  if (edits.length === 0) return null
  return rootNode.commitEdits(edits)
}

export default transform
