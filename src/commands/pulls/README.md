# Working with GitHub Pull Requests

## Global Options

```bash
--json   # Format command output as JSON string.
--token  # GitHub personal access token.
```

@see: [`README.md #Global Options`](https://github.com/Financial-Times/github/blob/master/README.md#global-options) for details.

## Commands

```bash
github <command>

# Display help for the command.
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
