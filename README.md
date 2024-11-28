# @expressjs/codemod

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]
[![OpenSSF Scorecard Badge][ossf-scorecard-badge]][ossf-scorecard-visualizer]

Express.js provides Codemod transforms to help you upgrade your express server when a feature is deprecated or removed.

Codemods are transformations that run on your codebase programmatically. This allows for a large amount of changes to be applied without having to manually go through every file.

## Installation

You don't need to install this package, run the following command:

```sh
npx @expressjs/codemod # or pnpx, bunx, etc.
```

or install globally:

```sh
npm i -g @expressjs/codemod # or pnpm, bun, etc.
```

## Usage

Use `@expressjs/codemod -h` to explore available command-line options.

<!-- GENERATED START -->

```
Usage: @expressjs/codemod [codemod] [source] [options]

Options:
  -v, --version  Output the current version of @expressjs/codemod.
  -d, --dry      Dry run (no changes are made to files)
  -h, --help     Display this help message.
```

<!-- GENERATED END -->

##  Contributing

The Express.js project welcomes all constructive contributions. Contributions take many forms,
from code for bug fixes and enhancements, to additions and fixes to documentation, additional
tests, triaging incoming pull requests and issues, and more!

See the [Contributing Guide](https://github.com/expressjs/express/blob/master/Contributing.md) for more technical details on contributing.

## License

[MIT](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/@expressjs/codemod
[npm-downloads-url]: https://npmcharts.com/compare/@expressjs/codemod?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/@expressjs/codemod
[npm-install-size-url]: https://packagephobia.com/result?p=@expressjs/codemod
[npm-url]: https://npmjs.org/package/@expressjs/codemod
[npm-version-image]: https://badgen.net/npm/v/@expressjs/codemod
[ossf-scorecard-badge]: https://api.scorecard.dev/projects/github.com/expressjs/codemod/badge
[ossf-scorecard-visualizer]: https://ossf.github.io/scorecard-visualizer/#/projects/github.com/expressjs/codemod