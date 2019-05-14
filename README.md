# 🦑 ika

## A human-friendly<sup>1</sup> command line tool for the GitHub API.

<sup>1</sup> It's script-friendly too. 

"Ika" (えび) is [Japanese for squid/cuttlefish](https://translate.google.com/#view=home&op=translate&sl=en&tl=ja&text=Squid). Like a squid, the `ika` command line tool is an elongated, fast-swimming cephalopod mollusk with ten arms (technically, eight arms and two long tentacles), typically able to change color.

`ika` lets you work with GitHub from your shell, and is delicious when lightly fried with garlic and spices.

![image](https://user-images.githubusercontent.com/224547/57698749-3a59c880-764e-11e9-8dc1-92587f4dd884.png)

## Installation

### Global installation (recommmended)

```bash
npm install --global ika
```

When you run the tool, it will automatically notify you if there is a newer version of it available for you to update to.

[You can disable notifications](https://www.npmjs.com/package/update-notifier#user-settings) if you'd prefer not to be notified about updates.

### No installation

```bash
npx ika
```

The `npx` command lets you use this tool without installing it. However, each time you use `npx` it downloads the whole package from the npm registry, which takes a while. That's why global installation is reccommended.

> Note: If this tool is globally installed, `npx ika` will use that globally installed version rather than downloading.

## Commands

```bash
ika

# Display help.
```

```bash
ika <command>

# Display help for the command.
```

```bash
ika --version

# Show the version number.
```

### Working with GitHub Projects

```bash
ika add-pull-request [--column-url] [--pull-request-url]

# Add a pull request to a GitHub project column.
```

```bash
ika close-project <github-url>

# Set the state of an existing project board to `closed`.
```

```bash
ika create-project <github-url> [--body]

# Create a new project.
```

@see: [`src/commands/projects/README.md`](https://github.com/Financial-Times/ika/blob/master/src/commands/projects/README.md) for more details.

### Working with GitHub Pull Requests

```bash
ika close-pull-request <github-url>

# Set the state of an existing pull request to `closed`.
```

```bash
ika create-comment <github-url> [--body]

# Create a comment on an existing pull request.
```

```bash
ika create-review-request <github-url> [reviewers|team-reviewers]

# Request a review for a pull request.
```

```bash
ika create-pull-request <github-url> [--base] [--body] [--title]

# Create a new pull request.
```

```bash
ika delete-comment <github-url>

# Delete a comment on an existing pull request.
```

```bash
ika delete-review-request <github-url> [reviewers|team-reviewers]

# Delete a review for a pull request.
```

```bash
ika merge-pull-request <github-url> [--method]

# Merge an existing pull request.
```

```bash
ika open-pull-request <github-url>

# Set the state of an existing pull request to `open`.
```

@see: [`src/commands/pulls/README.md`](https://github.com/Financial-Times/ika/blob/master/src/commands/pulls/README.md) for more details.

### Global Options

```bash
--json

# Format command output as JSON string.
```

```bash
--token

# GitHub personal access token.
# Generate one at https://github.com/settings/tokens
```

> Note: You can omit the `--token` argument, because it will default to  `$GITHUB_PERSONAL_ACCESS_TOKEN`.
>
> In that case you will need to export the token to your environment:

```bash
export $GITHUB_PERSONAL_ACCESS_TOKEN=[your token here]
```

# Developers

## Command hierarchy and directory structure

This project loosely follows the example provided in the Yargs documentation for command hierarchy and directory structure.

- @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
- @see: [`bin/ika.js`](https://github.com/Financial-Times/ika/blob/master/bin/ika.js) for the root `ika` command.
- @see: [`src/commands`](https://github.com/Financial-Times/ika/blob/master/src/commands/) for the `ika <command>` commands.

## Conventions

### CamelCase, hyphen-case and under_scores

- All yargs commands and filenames are in `hyphen-case`.
- All function names and variables are in `camelCase`.
- The parameters used by Octokit are in `under_score` format.

### Code formatting and linting

- The [.eslintrc.js](https://github.com/Financial-Times/ika/blob/master/.eslintrc.js) file contains the settings for code linting.

  - @see: https://eslint.org/

- Consider installing `eslint` in your editor. Plugins are available for most popular editors.

  - @see: https://eslint.org/docs/user-guide/integrations#editors

- Note: `.eslintrc.js` extends the `prettier` tool, which applies code formatting rules.

  - @see: https://prettier.io/docs/en/integrating-with-linters.html

- You can `npm run eslint-check` to check there are no conflicts between eslint and prettier configurations.

  - @see: https://github.com/prettier/eslint-config-prettier#cli-helper-tool

- The `prettier` tool uses the "@adambraimbridge/prettierrc-2019-05" configuration.

  - @see: https://www.npmjs.com/package/@adambraimbridge/prettierrc-2019-05

- Consider installing `prettier` in your editor. Plugins are available for most popular editors.

  - @see: https://prettier.io/docs/en/editors.html

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

# eslint src/ bin/ test/
```

```bash
npm run lint-fix

# eslint --fix eslint --fix src/ bin/ test/
```

```bash
npm run eslint-check

# eslint --print-config . | eslint-config-prettier-check
```
