# GitHub Command Line Tool

A human-friendly\* command line tool for the GitHub API.

\* it's script-friendly too.

![image](https://user-images.githubusercontent.com/224547/57020759-3b3c3480-6c22-11e9-8907-565a929d3cd9.png)

## Installation

### Global installation (recommmended)

```bash
npm install --global @financial-times/github
```

When you run the tool, it will automatically notify you if there is a newer version of it available for you to update to.

[You can disable notifications](https://www.npmjs.com/package/update-notifier#user-settings) if you'd prefer not to be notified about updates.

### No installation

```bash
npx @financial-times/github
```

The `npx` command lets you use this tool without installing it. However, each time you use `npx` it downloads the whole package from the npm registry, which takes a while. That's why global installation is reccommended.

> Note: If this tool is globally installed, `npx @financial-times/github` will use that globally installed version rather than downloading.

## Commands

```bash
github

# Display help.
```

```bash
github <command>

# Display help for the command.
```

```bash
github --version

# Show the version number.
```

```bash
github add-pull-request [--column-url] [--pull-request-url]

# Add a pull request to a GitHub project column.
```

```bash
github close-project <github-url>

# Set the state of an existing project board to `closed`.
```

```bash
github create-project <github-url> [--body]

# Create a new project.
```

```bash
github close-pull-request <github-url>

# Set the state of an existing pull request to `closed`.
```

```bash
github create-comment <github-url> [--body]

# Create a comment on an existing pull request.
```

```bash
github create-review-request <github-url> [reviewers|team-reviewers]

# Request a review for a pull request.
```

```bash
github create-pull-request <github-url> [--base] [--body] [--title]

# Create a new pull request.
```

```bash
github delete-comment <github-url>

# Delete a comment on an existing pull request.
```

```bash
github delete-review-request <github-url> [reviewers|team-reviewers]

# Delete a review for a pull request.
```

```bash
github merge-pull-request <github-url> [--method]

# Merge an existing pull request.
```

```bash
github open-pull-request <github-url>

# Set the state of an existing pull request to `open`.
```

### Global Options

```bash
--token

# GitHub personal access token.
# Generate one at https://github.com/settings/tokens
```

```bash
--json

# Format command output as JSON string.
```

# Developers

## Command hierarchy and directory structure

This project loosely follows the example provided in the Yargs documentation for command hierarchy and directory structure.

- @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
- @see: [`bin/github.js`](https://github.com/Financial-Times/github/blob/master/bin/github.js) for the root `github` command.
- @see: [`src/commands`](https://github.com/Financial-Times/github/blob/master/src/commands/) for the `github <command>` commands.

## Conventions

### CamelCase, hyphen-case and under_scores

- All yargs commands and filenames are in `hyphen-case`.
- All function names and variables are in `camelCase`.
- The parameters used by Octokit are in `under_score` format.

### Code formatting and linting

- The [.eslintrc.js](https://github.com/Financial-Times/github/blob/master/.eslintrc.js) file contains the settings for code linting.

  - @see: https://eslint.org/

- Note: `.eslintrc.js` extends the `prettier` tool, which applies code formatting rules.

  - @see: https://prettier.io/docs/en/integrating-with-linters.html

- You can `npm run eslint-check` to check there are no conflicts between eslint and prettier configurations.

  - @see: https://github.com/prettier/eslint-config-prettier#cli-helper-tool

- If you use Visual Studio Code, consider installing the "Prettier - Code formatter" plugin.

  - @see: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## Package.json scripts

```bash
npm run unit-test

# jest --coverage
```

```bash
npm run test

# npm run lint && npm run unit-test
```

```bash
npm run lint

# eslint src/
```

```bash
npm run lint-fix

# eslint --fix src/
```

```bash
npm run eslint-check

# eslint --print-config . | eslint-config-prettier-chec
```
