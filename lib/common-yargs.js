const fs = require('fs')

/**
 * These descriptions are exported so that they can be used to group global options in usage output.
 */
const descriptions = {
	token: 'GitHub personal access token. Generate one at https://github.com/settings/tokens.',
	json: 'Format command output as JSON string',
}

const withToken = options => yargs =>
	yargs
		.option(
			'token',
			Object.assign(
				{},
				{
					alias: 't',
					describe: descriptions.token,
					type: 'string',
					coerce: value => {
						if (!value) {
							throw new Error('Error: `--token` option is required as a valid GITHUB_PERSONAL_ACCESS_TOKEN environment variable does not exist')
						}
						return value
					},
				},
				options
			)
		)
		.default('token', process.env.GITHUB_PERSONAL_ACCESS_TOKEN, 'process.env.GITHUB_PERSONAL_ACCESS_TOKEN')

const withJson = options => yargs =>
	yargs.option(
		'json',
		Object.assign(
			{},
			{
				alias: 'j',
				describe: descriptions.json,
				type: 'boolean',
			},
			options
		)
	)

const withBody = options => yargs =>
	yargs
		.option(
			'body',
			Object.assign(
				{},
				{
					alias: 'b',
					describe: 'Path to pull request body',
					type: 'string',
				},
				options
			)
		)
		.check(argv => {
			/**
			 * Sometimes (especially during testing), `process.stdin.isTTY` gives a false negative.
			 * So make sure that '/dev/stdin' can be read. If not, then consider `stdin` to be absent.
			 */
			let hasStdin
			if (!process.stdin.isTTY) {
				try {
					fs.readFileSync('/dev/stdin')
					hasStdin = true
				} catch (error) {
					hasStdin = false
				}
			}
			const describe = 'Choose either to pipe through the body OR pass a file path as the --body argument'
			if (argv.body && hasStdin) {
				throw new Error(`Too many body inputs. ${describe}`)
			}
			if (!argv.body && !hasStdin) {
				throw new Error(`Body required. ${describe}`)
			}

			// The `projects create` handler expects the --body argument to be a filepath. So give it the path of `stdin` where appropriate.
			if (!argv.body && hasStdin) {
				argv.body = '/dev/stdin'
			}

			// Confirm that the required file exists
			if (!fs.existsSync(argv.body)) {
				throw new Error(`File not found: ${argv.body}`)
			}
			return true
		}, options)
		.middleware(argv => {
			// Load the content of the file indicated by `argv.body` and make it available as argv.bodyContent.
			try {
				argv.bodyContent = fs.readFileSync(argv.body, 'utf8')
			} catch (error) {
				argv.bodyContent = ''
			}
		})

const withBase = options => yargs =>
	yargs.option(
		'base',
		Object.assign(
			{},
			{
				describe: 'Base branch',
				type: 'string',
				default: 'master',
			},
			options
		)
	)

const withTitle = options => yargs =>
	yargs.option(
		'title',
		Object.assign(
			{},
			{
				describe: 'Pull request title',
				type: 'string',
			},
			options
		)
	)

const withGitHubUrl = options => yargs => {
	return yargs.positional(
		'github-url',
		Object.assign(
			{},
			{
				describe: 'A GitHub URL. Pattern: [https://][github.com]/[scope]/[owner]/[repository]/[endpoint]/[value]',
				type: 'string',
			},
			options
		)
	)
}

module.exports = {
	descriptions,
	withToken,
	withJson,
	withBase,
	withBody,
	withTitle,
	withGitHubUrl,
}
