# Express Collaborator Guide

This document contains information for Collaborators of the express codemod regarding maintaining the code, documentation.

## Getting Started

The steps below will give you a general idea of how to prepare your local environment for the express codemods and general steps for getting things done and landing your contribution.

1. [Create an issue](https://github.com/expressjs/codemod/issues/new) for the
   bug you want to fix or the feature that you want to add.
2. Create your own [fork](https://github.com/expressjs/codemod) on GitHub
3. Clone your fork using SSH, GitHub CLI, or HTTPS.
```sh
git clone git@github.com:<YOUR_GITHUB_USERNAME>/codemod.git # SSH
git clone https://github.com/<YOUR_GITHUB_USERNAME>/codemod.git # HTTPS
gh repo clone <YOUR_GITHUB_USERNAME>/codemod # GitHub CLI
```
4. Change into the nodejs.org directory.
```sh
cd codemod
```
5. Create a remote to keep your fork and local clone up-to-date.
```sh
git remote add upstream git@github.com:expressjs/codemod.git # SSH
git remote add upstream https://github.com/expressjs/codemod.git # HTTPS
gh repo sync expressjs/codemod # GitHub CLI
```
6. Create a new branch for your work.
```sh
git checkout -b name-of-your-branch
```
7. Run the following to install the dependencies and start a local build of your work.
```sh
npm ci # installs this project's dependencies
npm run dev # starts a development environment
```
8. Perform your changes
8. Ensure your code is linted by running `npm run lint` -- fix any issue you
   see listed.
9. If the tests pass, you can commit your changes to your fork and then create
   a pull request from there. Make sure to reference your issue from the pull
   request comments by including the issue number e.g. `#123`.

## How to add codemods

We use `jscodeshift` to create and run the codemods. To add a new codemod for Express, we follow the following process.

1. Create a new file in the `transforms` directory. For example, `transforms/pluralized-methods.ts`.

2. Write your codemod. Here's an example that pluralizes Express methods:

```typescript
// filepath: codemod/transforms/pluralized-methods.ts
import type { API, FileInfo } from 'jscodeshift'
import { Identifier, identifier } from 'jscodeshift'
import { getParsedFile } from '../utils/parse'

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

  return parsedFile.toSource()
}
```

3. Add tests to verify the functionality of the codemod
    - A new file is created in the `/transforms/__test__` directory with the same name as the codemod with the following content
    ```ts
    // filepath: codemod/transforms/__test__/pluralized-methods.ts

    import { testSpecBuilder } from './util'

    testSpecBuilder('magic-redirect')
    ```
    - Two new files are created, `name-codemod.input.ts` and `name_codemod.output.ts`, inside the `/transforms/__testfixtures__` directory
        - The files ending in `.input.ts ` contain the content that should be changed by the codemod
        - The `.output.ts` files contain the content that should be present after the codemod has been correctly applied.

4. To make the codemod visible within the CLI, the `config.ts` file is modified, where a brief description of the codemod, its name, and the version of Express to which the migration should be applied are added.

## Developer's Certificate of Origin 1.1

```text
By making a contribution to this project, I certify that:

 (a) The contribution was created in whole or in part by me and I
     have the right to submit it under the open source license
     indicated in the file; or

 (b) The contribution is based upon previous work that, to the best
     of my knowledge, is covered under an appropriate open source
     license and I have the right under that license to submit that
     work with modifications, whether created in whole or in part
     by me, under the same open source license (unless I am
     permitted to submit under a different license), as indicated
     in the file; or

 (c) The contribution was provided directly to me by some other
     person who certified (a), (b) or (c) and I have not modified
     it.

 (d) I understand and agree that this project and the contribution
     are public and that a record of the contribution (including all
     personal information I submit with it, including my sign-off) is
     maintained indefinitely and may be redistributed consistent with
     this project or the open source license(s) involved.
```