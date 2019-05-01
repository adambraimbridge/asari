# GitHub Command Line Tool

A human-friendly\* command line tool for the GitHub API.

\* it's script-friendly too.

![image](https://user-images.githubusercontent.com/224547/57020759-3b3c3480-6c22-11e9-8907-565a929d3cd9.png)

## Installation

### Global installation (recommmended)

```shell
npm install --global @financial-times/github
```

<blockquote>
When you run the tool, it will automatically notify you if there is a newer version of it available for you to update to.

[You can disable notifications](https://www.npmjs.com/package/update-notifier#user-settings) if you'd prefer not to be notified about updates.

</blockquote>

### No installation

```shell
npx @financial-times/github
```

<blockquote>

The `npx` command lets you use this tool without installing it. However, each time you use `npx` it downloads the whole package from the npm registry, which takes a while. That's why global installation is reccommended.

Note: If this tool is globally installed, `npx @financial-times/github` will use that globally installed version rather than downloading.

</blockquote>

## Commands

```shell
github
```

<blockquote>Display help.</blockquote>

```shell
github <command>
```

<blockquote>Display help for the command.</blockquote>

```shell
github --version
```

<blockquote>Show the version number.</blockquote>

```shell
github add-pull-request [--column-url] [--pull-request-url]
```

<blockquote>Add a pull request to a GitHub project column.</blockquote>

```shell
github close-project <github-url>
```

<blockquote>Set the state of an existing project board to `closed`.</blockquote>

```shell
github create-project <github-url> [--body]
```

<blockquote>Create a new project.</blockquote>

```shell
github close-pull-request <github-url>
```

<blockquote>Set the state of an existing pull request to `closed`.</blockquote>

```shell
github create-comment <github-url> [--body]
```

<blockquote>Create a comment on an existing pull request.</blockquote>

```shell
github create-review-request <github-url> [reviewers|team-reviewers]
```

<blockquote>Request a review for a pull request.</blockquote>

```shell
github create-pull-request <github-url> [--base] [--body] [--title]
```

<blockquote>Create a new pull request.</blockquote>

```shell
github delete-comment <github-url>
```

<blockquote>Delete a comment on an existing pull request.</blockquote>

```shell
github delete-review-request <github-url> [reviewers|team-reviewers]
```

<blockquote>Delete a review for a pull request.</blockquote>

```shell
github merge-pull-request <github-url> [--method]
```

<blockquote>Merge an existing pull request</blockquote>

```shell
github open-pull-request <github-url>
```

<blockquote>Set the state of an existing pull request to `open`.</blockquote>

### Global Options

```shell
--token
```

<blockquote>GitHub personal access token. Generate one at https://github.com/settings/tokens.</blockquote>

```shell
--json
```

<blockquote>Format command output as JSON string</blockquote>

# Developers

## Command hierarchy and directory structure

This project follows the example provided in the Yargs documentation for command hierarchy and directory structure.

- @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
- @see: [`src/commands`](https://github.com/Financial-Times/github/blob/master/src/commands/) for all available commands.

## Conventions

### CamelCase, hyphen-case and under_scores

- All yargs commands and filenames are in `hyphen-case`.
- All function names and variables are in `camelCase`.
- The parameters used by Octokit are in `under_score` format.

### Code formatting

- The [.vscode/settings.json](https://github.com/Financial-Times/github/blob/master/.vscode/settings.json) file contains the Visual Studio Code settings for the styling conventions used in this repository.
