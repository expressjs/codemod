import type { PathLike } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { async as glob } from 'fast-glob'

export async function isDirectory(path: PathLike): Promise<boolean> {
  try {
    const metadata = await stat(path)
    return metadata.isDirectory()
  } catch (err) {
    return false
  }
}

export async function getAllFiles(path: PathLike, arrayOfFiles: PathLike[] = []): Promise<PathLike[]> {
  if (await isDirectory(path)) {
    const files = await glob('**/*.{js,ts}', {
      cwd: path.toString(),
      dot: true,
      ignore: ['node_modules', 'dist', 'build'],
      markDirectories: true,
    })

    for (const file of files) {
      arrayOfFiles.push(resolve(join(path.toString(), file)))
    }
  } else {
    arrayOfFiles.push(resolve(path.toString()))
  }

  return arrayOfFiles
}

export async function getContent(path: PathLike): Promise<string> {
  return readFile(path, 'utf-8')
}
