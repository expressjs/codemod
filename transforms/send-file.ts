import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, withParser } from 'jscodeshift'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return parser(file.source)
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
    .toSource()
}
