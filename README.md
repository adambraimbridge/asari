# 🐚 asari

## A human-friendly<sup>1</sup> command line tool for the GitHub API.

<sup>1</sup> It's script-friendly too.

![image](https://user-images.githubusercontent.com/224547/58557351-1a153680-8216-11e9-9ebc-f25471405ea3.png)

> Above: Use `npx asari` in your shell to manage your work in GitHub.

"Asari" (あさり) is [Japanese for "clam"](https://translate.google.com/#view=home&op=translate&sl=en&tl=ja&text=clam). Like a clam, `asari` is happiest when it's inside a shell.

🐚 `asari` lets you work with GitHub from your command line, and is delicious when lightly fried with garlic and spices.

![image](https://user-images.githubusercontent.com/224547/58558164-010d8500-8218-11e9-9279-9b93307989a7.png)

_Above: Running `npx asari` from your command line shows you the top level of options and commands._

![image](https://user-images.githubusercontent.com/224547/58558212-213d4400-8218-11e9-8b46-42be9ea9d0e9.png)

![image](https://user-images.githubusercontent.com/224547/58558194-15518200-8218-11e9-8d48-0832558413ad.png)

![image](https://user-images.githubusercontent.com/224547/58558179-0c60b080-8218-11e9-8e17-d5823b55c5ad.png)

_Above: Running `npx asari <command>` shows you options for working with GitHub [issues](#working-with-github-issues), [projects](#working-with-github-projects) and [pull requests](#working-with-github-pull-requests)._

## Installation

### Global installation (recommmended)

```bash
npm install --global asari
```

When you run the tool, it will automatically notify you if there is a newer version of it available for you to update to.

[You can disable notifications](https://www.npmjs.com/package/update-notifier#user-settings) if you'd prefer not to be notified about updates.

### No installation

```bash
npx asari
```

The `npx` command lets you use this tool without installing it. However, each time you use `npx` it downloads the whole package from the npm registry, which takes a while. That's why global installation is reccommended.

> Note: If this tool is globally installed, `npx asari` will use that globally installed version rather than downloading.

## Commands

```bash
npx asari

# Display help.
```

```bash
npx asari <command>

# Display help for the command.
```

```bash
npx asari --version

# Show the version number.
```

```bash
npx asari allowance

# Display current GitHub API rate-limiting allowance.
```

```bash
npx asari completion

# Output a generated script. To enable bash/zsh completions:
#  1. Install asari globally.
#  2. Add the script to your .bashrc or .bash_profile (or .zshrc for zsh).
```

### Working with GitHub Issues

```bash
npx asari issues create <github-url> [--title] [--body] [--assignees]

# Create a new issue
```

```bash
npx asari issues open <github-url>

# Set the state of an existing issue to `open`
```

```bash
npx asari issues close <github-url>

# Set the state of an existing issue to `closed`
```

```bash
npx asari issues list [--type]

# List all issues assigned to the authenticated user.
```

```bash
npx asari issues list-for-repo <github-url>

# List all issues in a repository.
```

### Working with GitHub Projects

```bash
npx asari projects add [--column-url] [--url]

# Add a pull request to a GitHub project column.
```

```bash
npx asari projects close <github-url>

# Set the state of an existing project board to `closed`.
```

```bash
npx asari projects create <github-url> [--body]

# Create a new project.
```

### Working with GitHub Pull Requests

```bash
npx asari pulls close <github-url>

# Set the state of an existing pull request to `closed`.
```

```bash
npx asari pulls create-comment <github-url> [--body]

# Create a comment on an existing pull request.
```

```bash
npx asari pulls create-review-request <github-url> [reviewers|team-reviewers]

# Request a review for a pull request.
```

```bash
npx asari pulls create <github-url> [--base] [--body] [--title]

# Create a new pull request.
```

```bash
npx asari pulls delete-comment <github-url>

# Delete a comment on an existing pull request.
```

```bash
npx asari pulls delete-review-request <github-url> [reviewers|team-reviewers]

# Delete a review for a pull request.
```

```bash
npx asari pulls merge <github-url> [--method]

# Merge an existing pull request.
```

```bash
npx asari pulls open <github-url>

# Set the state of an existing pull request to `open`.
```

### Working with GitHub Topics

```bash
npx asari topics list <github-url>

# List all topics.
```

```bash
npx asari topics add <github-url> --topic new-app

# Add a topic

npx asari topics add <github-url> --topic new-app --topic good-one
npx asari topics add <github-url> --topic new-app,good-one
npx asari topics add <github-url> --topic "new-app,  good-one"
npx asari topics add <github-url> --topics new-app,good-one

# Add multiple topics
```

```bash
npx asari topics remove <github-url> --topic new-app

# Remove a topic

npx asari topics remove <github-url> --topic new-app --topic good-one
npx asari topics remove <github-url> --topic new-app,good-one
npx asari topics remove <github-url> --topic "new-app,  good-one"
npx asari topics remove <github-url> --topics new-app,good-one

# Remove multiple topics
```

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

> Note: You can omit the `--token` argument, because it will default to `$GITHUB_PERSONAL_ACCESS_TOKEN`.
>
> In that case you will need to export the token to your environment:

```bash
export $GITHUB_PERSONAL_ACCESS_TOKEN=[your token here]
```

# Developers

## Command hierarchy and directory structure

This project loosely follows the example provided in the Yargs documentation for command hierarchy and directory structure.

- @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
- @see: [`bin/asari.js`](https://github.com/Financial-Times/asari/blob/master/bin/asari.js) for the root `asari` command.
- @see: [`src/commands`](https://github.com/Financial-Times/asari/blob/master/src/commands/) for the `asari <command>` commands.

## Conventions

### CamelCase, hyphen-case and under_scores

- All yargs commands and filenames are in `hyphen-case`.
- All function names and variables are in `camelCase`.
- The parameters used by Octokit are in `under_score` format.

### Code formatting and linting

- The [.eslintrc.js](https://github.com/Financial-Times/asari/blob/master/.eslintrc.js) file contains the settings for code linting.

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
