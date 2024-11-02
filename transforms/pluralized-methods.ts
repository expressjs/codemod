import { API, FileInfo, Identifier, identifier } from "jscodeshift";
import { getParsedFile } from "../utils/parse";

export default function transformer(file: FileInfo, _api: API) {
  const parsedFile = getParsedFile(file);

  const identifierNamesToReplace = [
    "acceptsLanguage",
    "acceptsCharset",
    "acceptsEncoding",
  ];

  identifierNamesToReplace.forEach((singular) => {
    const plural = `${singular}s`;

    parsedFile
      .find(Identifier, {
        name: singular,
      })
      .replaceWith(() => identifier(plural));
  });

  return parsedFile.toSource();
}
