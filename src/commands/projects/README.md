# Working with GitHub Projects

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
github add-pull-request [--column-url] [--pull-request-url]

# Add a pull request to a GitHub project column.
```

Get `--column-url` from the "Copy column link" option in the "`...`" menu button on your "Projects" page:

![image](https://user-images.githubusercontent.com/224547/57067238-5e202480-6cc6-11e9-92dc-dfc663a66105.png)


```bash
github close-project <github-url>

# Set the state of an existing project board to `closed`.
```

```bash
github create-project <github-url> [--body]

# Create a new project.
```
