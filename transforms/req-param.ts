import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, memberExpression, withParser } from 'jscodeshift'
import { recursiveParent } from '../utils/recursiveParent'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return (
    parser(file.source)
      .find(CallExpression, {
        callee: {
          property: {
            name: 'param',
          },
        },
      })
      .filter((path) => Boolean(recursiveParent(path.parentPath)))
      .map((path) => {
        console.log(path.node.arguments)
        const pathArguments = path.node.arguments

        if (pathArguments.length > 1) {
          return path
        }

        if (pathArguments[0].type === 'StringLiteral') {
          if (pathArguments[0].value === 'query') {
            // convert to req.query
            return memberExpression()
          }
          if (pathArguments[0].value === 'body') {
            // convert to req.body
            return memberExpression()
          }

          // convert to req.params.[value]
          return memberExpression()
        }
      })
      // TODO: req.param(name): This method has been deprecated. Instead, access parameters directly via req.params, or use req.body or req.query as needed.
      .toSource()
  )
}
