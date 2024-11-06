import type { API, FileInfo } from 'jscodeshift'
import { CallExpression, withParser } from 'jscodeshift'

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
      // TODO: res.send(status, body) and res.send(body, status) signatures: Use res.status(status).send(body).
      // TODO: res.send(status) signature: Use res.sendStatus(status) for simple status responses, or res.status(status).send() for sending a status code with an optional body.
      .toSource()
  )
}
