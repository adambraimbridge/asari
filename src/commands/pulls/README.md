# Working with GitHub Pull Requests

## Global Options

```bash
--json   # Format command output as JSON string.
--token  # GitHub personal access token.
```

@see: [`README.md #Global Options`](https://github.com/Financial-Times/github/blob/master/README.md#global-options) for details.

## Commands

```bash
ika <command>

# Display help for the command.
```

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
