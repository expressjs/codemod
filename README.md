# @expressjs/codemod

[![OpenSSF Scorecard Badge][ossf-scorecard-badge]][ossf-scorecard-visualizer]

Express.js provides Codemod transforms to help you upgrade your express server when a feature is deprecated or removed.

Codemods are transformations that run on your codebase programmatically. This allows for a large amount of changes to be applied without having to manually go through every file.

## Usage

### From Registry

With the codemod CLI you can run a workflow from the Codemod Registry. Replace `<codemod>` with the name of the codemod you want to run:

```sh
npx codemod @expressjs/<codemod>
```

For see the list of available codemods, visit the [Express.js Codemod Registry](https://codemod.link/express).

### From source

You can also clone the repository and run the codemods locally. First, clone the repository:

```sh
git clone https://github.com/expressjs/codemod.git
cd /path/to/your-project
npx codemod workflow run -w /path/to/codemod/codemods/<recipe>/workflow.yaml
```

See the [codemod CLI doc](https://docs.codemod.com/cli) for a full list of available commands.

##  Contributing

The Express.js project welcomes all constructive contributions. Contributions take many forms,
from code for bug fixes and enhancements, to additions and fixes to documentation, additional
tests, triaging incoming pull requests and issues, and more!

See the [Contributing Guide](https://github.com/expressjs/codemod/blob/main/CONTRIBUTING.md) for more technical details on contributing.


## License

[MIT](LICENSE)

[ossf-scorecard-badge]: https://api.scorecard.dev/projects/github.com/expressjs/codemod/badge
[ossf-scorecard-visualizer]: https://ossf.github.io/scorecard-visualizer/#/projects/github.com/expressjs/codemod