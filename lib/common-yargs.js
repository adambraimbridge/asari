const fs = require('fs')

/**
 * These descriptions are exported so that they can be used to group global options in usage output.
 */
const descriptions = {
	token: 'GitHub personal access token. Uses `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable by default. Generate one at https://github.com/settings/tokens.',
	json: 'Format command output as JSON string',
}

const withToken = options => yargs =>
	yargs
		.option(
			'token',
			Object.assign({}, options, {
				describe: descriptions.token,
				type: 'string',
				coerce: value => {
					if (!value) {
						throw new Error('Error: `--token` option is required as a valid GITHUB_PERSONAL_ACCESS_TOKEN environment variable does not exist')
					}
					return value
				},
			})
		)
		.default('token', process.env.GITHUB_PERSONAL_ACCESS_TOKEN, '(GITHUB_PERSONAL_ACCESS_TOKEN)')

const withJson = options => yargs =>
	yargs.option(
		'json',
		Object.assign({}, options, {
			describe: descriptions.json,
			type: 'boolean',
		})
	)

const withGitHubUrl = options => yargs =>
	yargs.option(
		'github-url',
		Object.assign({}, options, {
			describe: 'A GitHub URL in the form of https://github.com/[owner]/[repository] (`owner` is a GitHub `org` or `user`.)',
			type: 'string',
		})
	)

const withBody = options => yargs =>
	yargs
		.option(
			'body',
			Object.assign({}, options, {
				describe: 'Path to pull request body',
				type: 'string',
			})
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

			// The --body argument expects a filepath. So give it the path of `stdin` where appropriate.
			if (!argv.body && hasStdin) {
				argv.body = '/dev/stdin'
			}

			// Confirm that the required file exists
			if (!fs.existsSync(argv.body)) {
				throw new Error(`File not found: ${argv.body}`)
			}
			return true
		})

const withBase = options => yargs =>
	yargs.option(
		'base',
		Object.assign({}, options, {
			describe: 'Base branch',
			type: 'string',
			default: 'master',
		})
	)

const withOwner = options => yargs =>
	yargs.option(
		'owner',
		Object.assign({}, options, {
			alias: 'o',
			describe: 'Owner',
			type: 'string',
			demandOption: true,
		})
	)

const withRepo = options => yargs =>
	yargs.option(
		'repo',
		Object.assign({}, options, {
			alias: 'r',
			describe: 'Repository',
			type: 'string',
		})
	)

const withNumber = options => yargs =>
	yargs.option(
		'number',
		Object.assign({}, options, {
			alias: 'n',
			describe: 'Number',
			type: 'integer',
			demandOption: true,
		})
	)

const withReviewers = options => yargs =>
	yargs.option(
		'reviewers',
		Object.assign({}, options, {
			describe: 'Reviewers',
			type: 'string',
		})
	)

const withTeamReviewers = options => yargs =>
	yargs.option(
		'team_reviewers',
		Object.assign({}, options, {
			describe: 'Team reviewers',
			type: 'string',
		})
	)

const withTitle = options => yargs =>
	yargs.option(
		'title',
		Object.assign({}, options, {
			alias: 't',
			describe: 'Pull request title',
			type: 'string',
		})
	)

const withAccountType = options => yargs =>
	yargs.option(
		'account_type',
		Object.assign({}, options, {
			alias: 'a',
			describe: 'The GitHub account type. Either "user", "org" (Organisation) or "repo" (Repository).',
			type: 'string',
		})
	)

const withPullRequest = yargs =>
	yargs.positional('pull-request', {
		describe: 'Pull request URL, e.g. https://github.com/foo/bar/pull/3',
		type: 'string',
		coerce: pullRequest => {
			const re = /https:\/\/github\.com\/(?<owner>.+)\/(?<repo>.+)\/pull\/(?<number>\d+)/
			const matches = re.exec(pullRequest)

			if (matches === null) {
				throw new Error(`"${pullRequest}" is not a valid pull request URL`)
			}

			return matches.groups
		},
	})

module.exports = {
	descriptions,
	withToken,
	withJson,
	withGitHubUrl,
	withBase,
	withOwner,
	withRepo,
	withNumber,
	withReviewers,
	withTeamReviewers,
	withBody,
	withTitle,
	withAccountType,
	withPullRequest,
}
