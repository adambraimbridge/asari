/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-issues-list
 * List all issues assigned to the authenticated user across all visible repositories.
 * const result = await octokit.issues.list([filter])
 */
const printOutput = require('../../lib/print-output')
const authenticatedOctokit = require('../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	return (
		yargs
			.option('type', {
				describe: 'Which type of issue.',
				choices: ['all', 'assigned', 'created', 'mentioned', 'subscribed'],
				demandOption: true,
			})
			/**
			 * Give an appropriate error message
			 */
			.fail((message, error, yargs) => {
				yargs.showHelp()
				if (message.includes('Missing required argument: type')) {
					console.error(`\nMissing required argument: type. Choices:
 * assigned (default): Issues assigned to you.
 * created: Issues created by you.
 * mentioned: Issues mentioning you.
 * subscribed: Issues you're subscribed to updates for.                     
 * all: All issues you are authenticated to see.
                    `)
				} else {
					console.error(message)
				}
				process.exit(1)
			})
	)
}

/**
 * List all issues for the authenticated user.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.type - Indicates which sorts of issues to return.
 */
const handler = async ({ token, json, type }) => {
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.issues.list({ type })
		result.data.forEach(issue => {
			const { title, created_at, html_url } = issue
			console.log('\x1b[36m%s\x1b[0m %s \x1b[2m%s\x1b[0m', created_at, title, html_url)
		})
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'list [--type]',
	desc: 'List all issues assigned to the authenticated user.',
	builder,
	handler,
}
