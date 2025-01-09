import {
  type API,
  type ASTPath,
  CallExpression,
  type FileInfo,
  callExpression,
  identifier,
  literal,
  logicalExpression,
  memberExpression,
} from 'jscodeshift'
import { getParsedFile } from '../utils/parse'
import { recursiveParent } from '../utils/recursiveParent'

const unifiedMagicString = (path: ASTPath<CallExpression>, projectRequestName: string) => {
  const pathArguments = path.value.arguments

  if (pathArguments.length === 1 && pathArguments[0]?.type === 'StringLiteral' && pathArguments[0].value === 'back') {
    path.value.arguments = [
      logicalExpression(
        '||',
        callExpression(memberExpression(identifier(projectRequestName), identifier('get')), [identifier('"Referrer"')]),
        literal('/'),
      ),
    ]

    return path
  }
}

export default function transformer(file: FileInfo, _api: API) {
  const parsedFile = getParsedFile(file)

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'redirect',
        },
      },
    })
    .map((path) => unifiedMagicString(path, recursiveParent(path.parentPath) || 'req'))

  parsedFile
    .find(CallExpression, {
      callee: {
        property: {
          name: 'location',
        },
      },
    })
    .map((path) => unifiedMagicString(path, recursiveParent(path.parentPath) || 'req'))

  return parsedFile.toSource()
}
