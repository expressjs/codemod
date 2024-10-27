import { API, FileInfo } from "jscodeshift";

export default function transformer(file: FileInfo, _api: API) {
    return file.source;
}
