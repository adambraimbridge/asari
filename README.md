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
npx @financial-times/github --help
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

See [`examples/examples.js`](https://github.com/Financial-Times/github/blob/master/examples/examples.js) for a full set of usage examples.

See [`src/lib/github.js`](https://github.com/Financial-Times/github/blob/master/src/lib/github.js) for all available methods.
