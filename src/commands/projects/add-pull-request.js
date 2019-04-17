/**
 * This command adds a pull request to a GitHub project column.
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createCard
 * const result = await octokit.projects.createCard({column_id, note, content_id, content_type})
 * /projects/columns/:column_id/cards
 */
const flow = require('lodash.flow')

const commonYargs = require('../../../lib/common-yargs')
const parseGitHubURL = require('../../../lib/parse-github-url')
const printOutput = require('../../../lib/print-output')
const authenticatedOctokit = require('../../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		// prettier-ignore
		commonYargs.withToken(),
		commonYargs.withJson(),
	])
	return (
		baseOptions(yargs)
			.option('column-id', {
				describe: 'Project column ID (Either a number OR a GitHub URL that contains the column ID)',
				demandOption: true,
			})
			.option('pull-request-id', {
				describe: 'Pull request ID (Either a number OR a GitHub URL that contains the pull request ID)',
				demandOption: true,
			})
			/**
			 * Allow either integers or GitHub URLs.
			 */
			.coerce(['column-id', 'pull-request-id'], arg => {
				const number = Number(arg)
				if (Number.isInteger(number)) {
					return arg
				} else {
					return parseGitHubURL(arg).value
				}
			})
	)
}

/**
 * Add a pull request to a GitHub project column.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {number} argv.columnId
 * @param {number} argv.pullRequestId
 */
const handler = async ({ token, json, columnId, pullRequestId }) => {
	const inputs = {
		column_id: columnId,
		content_id: pullRequestId,
		content_type: 'PullRequest',
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.projects.createCard(inputs)
		printOutput({ json, resource: result.data })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'add-pull-request [options]',
	desc: 'Add a pull request to a GitHub project column',
	builder,
	handler,
}
