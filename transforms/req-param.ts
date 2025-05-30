import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, identifier, memberExpression, withParser } from 'jscodeshift'
import { getOptions } from '../utils/recastOptions'
import { recursiveParent } from '../utils/recursiveParent'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return parser(file.source)
    .find(CallExpression, {
      callee: {
        property: {
          name: 'param',
        },
      },
    })
    .filter((path) => Boolean(recursiveParent(path.parentPath)))
    .replaceWith((path) => {
      const pathArguments = path.node.arguments

      if (pathArguments.length > 1) {
        return path
      }

      if (pathArguments[0].type === 'StringLiteral') {
        if (pathArguments[0].value === 'query') {
          // convert to req.query
          return memberExpression(identifier(recursiveParent(path.parentPath) || 'req'), identifier('query'))
        }
        if (pathArguments[0].value === 'body') {
          // convert to req.body
          return memberExpression(identifier(recursiveParent(path.parentPath) || 'req'), identifier('body'))
        }

        // convert to req.params.[value]
        return memberExpression(
          memberExpression(identifier(recursiveParent(path.parentPath) || 'req'), identifier('params')),
          identifier(pathArguments[0].value),
        )
      }

      return path
    })
    .toSource(getOptions(file.source))
}
