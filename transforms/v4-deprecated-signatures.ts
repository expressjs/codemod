import type { API, ASTPath, FileInfo } from 'jscodeshift'
import { CallExpression, callExpression, identifier, memberExpression, withParser } from 'jscodeshift'
import { recursiveParent } from '../utils/recursiveParent'

const separateStatusAndBody = (path: ASTPath<CallExpression>, calleePropertyName: string) => {
  const pathArguments = path.node.arguments
  const statusParamIndex = pathArguments.findIndex((arg) => arg.type === 'NumericLiteral')
  const bodyParamIndex = pathArguments.findIndex((arg) => arg.type !== 'NumericLiteral')

  path.replace(
    callExpression(
      memberExpression(
        callExpression(
          memberExpression(identifier(recursiveParent(path.parentPath, 1) || 'res'), identifier('status')),
          [pathArguments[statusParamIndex]],
        ),
        identifier(calleePropertyName),
      ),
      [pathArguments[bodyParamIndex]],
    ),
  )
}

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')
  const parsedFile = parser(file.source)

  parsedFile
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
        separateStatusAndBody(path, 'send')
      } else if (pathArguments.length === 1) {
        const statusValue = pathArguments[0].type === 'NumericLiteral' ? pathArguments[0].value : false

        if (statusValue) {
          path.replace(
            callExpression(
              memberExpression(identifier(recursiveParent(path.parentPath, 1) || 'res'), identifier('sendStatus')),
              [pathArguments[0]],
            ),
          )
        }
      }

      return path
    })

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'json',
        },
      },
    })
    .map((path) => {
      // from v3: https://expressjs.com/en/3x/api.html#res.json
      const pathArguments = path.node.arguments

      if (pathArguments.length === 2) {
        separateStatusAndBody(path, 'json')
      }

      return path
    })

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'jsonp',
        },
      },
    })
    .map((path) => {
      // from v3: https://expressjs.com/en/3x/api.html#res.jsonp
      const pathArguments = path.node.arguments

      if (pathArguments.length === 2) {
        separateStatusAndBody(path, 'jsonp')
      }

      return path
    })

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'del',
        },
      },
    })
    .map((path) => {
      const pathArguments = path.node.arguments

      if (
        pathArguments[0].type !== 'RegExpLiteral' &&
        pathArguments[0].type !== 'StringLiteral' &&
        pathArguments[0].type !== 'ArrayExpression'
      )
        return path

      if (path.node.callee.type === 'MemberExpression' && path.node.callee.property.type === 'Identifier') {
        path.node.callee.property.name = 'delete'
      }

      return path
    })

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'sendfile',
        },
      },
    })
    .map((path) => {
      if (path.node.callee.type === 'MemberExpression' && path.node.callee.property.type === 'Identifier') {
        path.node.callee.property.name = 'sendFile'
      }

      return path
    })

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'redirect',
        },
      },
    })
    .map((path) => {
      if (path.value.arguments.length === 2) {
        path.value.arguments.reverse()
      }

      return path
    })

  return parsedFile.toSource()
}
