# Express Collaborator Guide

This document contains information for Collaborators of the express codemod regarding maintaining the code, documentation.

## Getting Started

The steps below will give you a general idea of how to prepare your local environment for the express codemods and general steps for getting things done and landing your contribution.

1. [Create an issue](https://github.com/expressjs/codemod/issues/new) for the
   bug you want to fix or the feature that you want to add.

1. Create your own [fork](https://github.com/expressjs/codemod) on GitHub
   
1. Clone your fork using SSH, GitHub CLI, or HTTPS.

```sh
git clone git@github.com:<YOUR_GITHUB_USERNAME>/codemod.git # SSH
git clone https://github.com/<YOUR_GITHUB_USERNAME>/codemod.git # HTTPS
gh repo clone <YOUR_GITHUB_USERNAME>/codemod # GitHub CLI
```

1. Change into the codemod directory.
```sh
cd codemod
```

1. Create a remote to keep your fork and local clone up-to-date.

```sh
git remote add upstream git@github.com:expressjs/codemod.git # SSH
git remote add upstream https://github.com/expressjs/codemod.git # HTTPS
gh repo sync expressjs/codemod # GitHub CLI
```

1. Create a new branch for your work.

```sh
git checkout -b name-of-your-branch
```

1. Run the following to install the dependencies.

```sh
npm ci # installs this project's dependencies

```
1. create the [new codemod](#how-to-add-codemods) or make your changes.
   
1. Ensure your code is linted by running `npm run lint` -- fix any issue you
   see listed.

1. If the tests pass, you can commit your changes to your fork and then create
   a pull request from there. Make sure to reference your issue from the pull
   request comments by including the issue number e.g. `#123`.

## How to add codemods

Each codemod recides in its own directory inside the `codemods` folder. For initializing a new codemod, you can use the following command in the root of the repository and change the parameters as needed:

```sh
npx codemod init codemods/name-of-codemod --name @expressjs/name-of-codemod --description "Brief description of the codemod" --git-repository-url "git+https://github.com/expressjs/codemod.git" --author "your-github-username (Your Name)" --language typescript --project-type ast-grep-js --package-manager npm --license MIT --no-interactive
```

Then, rename the `scripts` folder to `src` to keep it consistent with the rest of the repository. After that, you can start implementing your codemod by editing the `codemod.yaml` file and adding any additional files your codemod requires.

## Useful Resources

- [Codemod CLI Reference](https://docs.codemod.com/cli/cli-reference)
- [Codemod Workflow Documentation](https://docs.codemod.com/cli/workflows)
- [Codemod Studio Documentation](https://docs.codemod.com/codemod-studio)
- [JS ast-grep (jssg) API reference](https://docs.codemod.com/jssg/reference)
- [JS ast-grep Testing Utilities](https://docs.codemod.com/jssg/testing)
- [JS ast-grep Semantic Analysis](https://docs.codemod.com/jssg/semantic-analysis)
- [ast-grep Documentation](https://ast-grep.github.io/)


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
