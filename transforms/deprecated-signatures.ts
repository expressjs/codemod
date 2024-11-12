import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, callExpression, identifier, memberExpression, withParser } from 'jscodeshift'
import { recursiveParent } from '../utils/recursiveParent'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return parser(file.source)
    .find(CallExpression, {
      callee: {
        property: {
          name: 'send',
        },
      },
    })
    .map((path) => {
      // from v3: https://expressjs.com/en/3x/api.html#res.send
      const pathArguments = path.node.arguments
      if (pathArguments.length === 2) {
        const statusParamIndex = pathArguments.findIndex((arg) => arg.type === 'NumericLiteral')
        const bodyParamIndex = pathArguments.findIndex((arg) => arg.type !== 'NumericLiteral')

        path.replace(
          callExpression(
            memberExpression(
              callExpression(
                memberExpression(identifier(recursiveParent(path.parentPath, 1) || 'res'), identifier('status')),
                [pathArguments[statusParamIndex]],
              ),
              identifier('send'),
            ),
            [pathArguments[bodyParamIndex]],
          ),
        )
      } else if (pathArguments.length === 1) {
        const statusValue = pathArguments[0].type === 'NumericLiteral' ? pathArguments[0].value : false
        path.replace(
          callExpression(
            memberExpression(identifier(recursiveParent(path.parentPath, 1) || 'res'), identifier('sendStatus')),
            statusValue ? [pathArguments[0]] : [],
          ),
        )
      }

      return path
    })
    .toSource()
}
