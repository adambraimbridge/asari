# GitHub Command Line Tool

Human-friendly command line tool for the GitHub API.

## Usage

### Command Line Tool

```
$ npx @financial-times/github --help
github <command>

Commands:
  github project:add-pull-request  Add a pull request to a project
  github project:create            Create a new project
  github pull-request:create       Create a new pull request

Options:
  --token    GitHub personal access token                              [string]
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### Library

```
npm install --save @financial-times/github
```

```javascript
const github = require('@financial-times/github')({
    personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});
```

See [`examples/examples.js`](https://github.com/Financial-Times/github-tooling-helper/blob/master/examples/examples.js) for a full set of usage examples.

See [`src/index.js`](https://github.com/Financial-Times/github-tooling-helper/blob/master/src/index.js) for all available methods.
