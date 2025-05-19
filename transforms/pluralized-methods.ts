import type { API, FileInfo } from 'jscodeshift'
import { Identifier, identifier } from 'jscodeshift'
import { getParsedFile } from '../utils/parse'
import { getOptions } from '../utils/recastOptions'

export default function transformer(file: FileInfo, _api: API): string {
  const parsedFile = getParsedFile(file)

  const identifierNamesToReplace = ['acceptsLanguage', 'acceptsCharset', 'acceptsEncoding']

  for (const singular of identifierNamesToReplace) {
    const plural = `${singular}s`

    parsedFile
      .find(Identifier, {
        name: singular,
      })
      .replaceWith(() => identifier(plural))
  }

  return parsedFile.toSource(getOptions(file.source))
}
