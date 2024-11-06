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
      // TODO: res.json(status, obj) and res.json(obj, status) signatures: Use res.status(status).json(obj).
      // TODO: res.jsonp(status, obj) and res.jsonp(obj, status) signatures: Use res.status(status).jsonp(obj).
      .toSource()
  )
}
