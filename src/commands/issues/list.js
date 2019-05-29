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
					console.error(`\nMissing required argument: type. Choices: \n * assigned: Issues assigned to you. \n * created: Issues created by you. \n * mentioned: Issues mentioning you. \n * subscribed: Issues you're subscribed to updates for. \n * all: All issues you are authenticated to see.`)
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

		// @see https://github.com/octokit/rest.js/blob/master/docs/src/pages/api/00_usage.md#pagination
		const request = octokit.issues.list.endpoint.merge({ filter: type })
		const result = await octokit.paginate(request)

		if (json) {
			printOutput({ json, resource: result })
		} else {
			result.forEach(issue => {
				const { title, created_at, html_url, assignees } = issue
				const assigneeString = assignees.map(user => user.login).join(', ')
				console.log(
					// Prettier-ignore
					`\x1b[36m${created_at}\x1b[0m`,
					title,
					`\x1b[33m${assigneeString || 'unassigned'}\x1b[0m`,
					`\x1b[2m${html_url}\x1b[0m`
				)
			})
		}
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
