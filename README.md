# GitHub Command Line Tool

Human-friendly command line tool for the GitHub API.

## Usage

### Command Line Tool

#### Install globally (recommmended)

```shell
npm install --global @financial-times/github

github --help
```
When you run the tool it will automatically notify you if there is a newer
version of it available for you to update to. This
[can be disabled](https://www.npmjs.com/package/update-notifier#user-settings)
if you'd prefer not to be notified about updates.

Note: If you install this tool globally on your machine and then run
`npx @financial-times/github`, it will use the globally installed version of the
tool rather than temporarily installing it from the npm registry.

#### No installation

If you just want to try this tool out without installing it, you can run it with
[`npx`](https://www.npmjs.com/package/npx) e.g.

```shell
$ npx @financial-times/github --help
github <command>

Commands:
  github project:add-pull-request  Add a pull request to a project
  github projects:create           Create a new project
  github pull-request:create       Create a new pull request

Options:
  --token    GitHub personal access token                              [string]
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### Library

```
npm install @financial-times/github
```

```javascript
const github = require("@financial-times/github")({
  personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});
```

# Developers

## Command hierarchy and directory structure

This project follows the example provided in the Yargs documentation for command hierarchy and directory structure. 

 - @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
 - @see: [`src/commands`](https://github.com/Financial-Times/github/blob/master/src/commands/) for all available commands.

## Conventions: CamelCase and under_scores

All commands and variables are consistent with the Ocktokit and GitHub APIs documentation, respectively:

 - https://octokit.github.io/rest.js/#api-Pulls <-- Instead of camelCaseFormat, we use hyphen-format. 
 - https://developer.github.com/v3/pulls <-- Variables are under_score_format.
