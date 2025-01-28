import isGitClean from 'is-git-clean'
import { yellow } from 'picocolors'

export function checkGitStatus(root: string) {
  let clean = false

  try {
    clean = isGitClean.sync(root)
  } catch (err) {
    if (err?.stderr?.includes('Not a git repository')) {
      clean = true
    }
  }

  if (!clean) {
    console.log('Thank you for using @expressjs/codemod!\n')
    console.log(yellow('But before we continue, please stash or commit your git changes.'))
    process.exit(1)
  }
}
