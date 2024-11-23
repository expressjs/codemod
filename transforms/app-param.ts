import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, withParser } from 'jscodeshift'

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
      // TODO: The app.param(fn) signature was used for modifying the behavior of the app.param(name, fn) function
      // Add comment line before with this information
      .toSource()
  )
}
