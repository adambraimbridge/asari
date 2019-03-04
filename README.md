# github

This package is a wrapper around the official GitHub REST API client for
JavaScript [@octokit/rest](https://github.com/octokit/rest.js) - it exposes a
library and a command line interface (CLI).

_Note:_ Requires a [GitHub personal access token](#github-personal-access-token-security)
for GitHub API requests that require authentication.

## Usage

### Library

```
npm install @financial-times/github
```

```javascript
const github = require('@financial-times/github')({
    personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});
```

See [`examples/examples.js`](examples/examples.js) for a full set of
usage examples.

See [`src/index.js`](src/index.js) for all available methods.

### Command line interface (CLI)

```
$ npx @financial-times/github --help
github <command>

Commands:
  github project:add-pull-request  Add a pull request to a project
  github project:create            Create a new project
  github pull-request:create       Create a new pull request

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## GitHub personal access token security

<!-- TODO: Update the wording -->

Some of the tooling helpers require a GitHub personal access token with all
`repo` scopes. This is _very powerful_ as it has access to modify a
repository's settings, so it is strongly recommended that you follow the guide
on [How to store and access a GitHub personal access token securely](https://github.com/Financial-Times/next/wiki/How-to-store-and-access-a-GitHub-personal-access-token-securely).
