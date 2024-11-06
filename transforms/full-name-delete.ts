import { type API, type FileInfo, Identifier, identifier } from 'jscodeshift'
import { getParsedFile } from '../utils/parse'

export default function transformer(file: FileInfo, _api: API) {
  const parsedFile = getParsedFile(file)

  parsedFile
    .find(Identifier, {
      name: 'del',
    })
    .replaceWith(() => identifier('delete'))

  return parsedFile.toSource()
}
