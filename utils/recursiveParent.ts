import type { ASTNode, ASTPath, ArrowFunctionExpression, FunctionExpression } from 'jscodeshift'

const defaultParentExpressionType = ['ArrowFunctionExpression', 'FunctionExpression'] as const

export const recursiveParent = (
  parent: ASTPath<ASTNode>,
  paramIndex = 0,
  parentExpressionType = defaultParentExpressionType,
): string | null => {
  if (parentExpressionType.some((type) => parent.value?.type === type)) {
    const foundNode = parent.value as unknown as ArrowFunctionExpression | FunctionExpression
    if (foundNode.params[paramIndex]?.type === 'Identifier') {
      return foundNode.params[paramIndex].name
    }
    return null
  }

  if (parent?.parentPath) {
    return recursiveParent(parent.parentPath, paramIndex, parentExpressionType)
  }

  return null
}
