import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, callExpression, identifier, memberExpression, withParser } from 'jscodeshift'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return (
    parser(file.source)
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

          // TODO
        } else if (pathArguments.length === 1) {
          const statusValue = pathArguments[0].type === 'Identifier' ? pathArguments[0].name : false
          path.value.callee = callExpression(
            memberExpression(identifier('res'), identifier('sendStatus')),
            statusValue ? [identifier(statusValue)] : [],
          )
        }

        return path
      })
      // TODO: res.send(status, body) and res.send(body, status) signatures: Use res.status(status).send(body).
      .toSource()
  )
}
