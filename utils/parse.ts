import { FileInfo, withParser } from "jscodeshift";

export const getParsedFile = (file: FileInfo) => {
  return withParser("ts")(file.source);
};
