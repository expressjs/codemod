import {
  type API,
  type ASTNode,
  type ASTPath,
  type ArrowFunctionExpression,
  CallExpression,
  type FileInfo,
  type FunctionExpression,
  callExpression,
  identifier,
  literal,
  logicalExpression,
  memberExpression,
} from 'jscodeshift'
import { getParsedFile } from '../utils/parse'

const parentExpressionType = ['ArrowFunctionExpression', 'FunctionExpression'] as const

const unifiedMagicString = (path: ASTPath<CallExpression>, projectRequestName: string) => {
  const pathArguments = path.value.arguments
  if (pathArguments.length === 1 && pathArguments[0].type === 'StringLiteral' && pathArguments[0].value === 'back') {
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

const recursiveParent = (parent: ASTPath<ASTNode>): string | null => {
  if (parentExpressionType.some((type) => parent.value.type === type)) {
    const foundNode = parent.value as unknown as ArrowFunctionExpression | FunctionExpression
    if (foundNode.params[0].type === 'Identifier') {
      return foundNode.params[0].name
    }
    return null
  }

  if (parent?.parentPath) {
    return recursiveParent(parent.parentPath)
  }

  return null
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
