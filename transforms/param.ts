import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, withParser } from 'jscodeshift'

export default function transformer(file: FileInfo, _api: API): string {
  const parser = withParser('ts')

  return (
    parser(file.source)
      .find(CallExpression, {
        callee: {
          property: {
            name: 'json',
          },
        },
      })
      // TODO: app.param(fn): This method has been deprecated. Instead, access parameters directly via req.params, or use req.body or req.query as needed.
      // Add comment line before with this information
      .toSource()
  )
}
