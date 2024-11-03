import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, withParser } from 'jscodeshift'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return parser(file.source)
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
    .toSource()
}
