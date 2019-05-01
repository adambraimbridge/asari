/**
 * This command adds a pull request to a GitHub project column.
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-create-card
 * const result = await octokit.projects.createCard({column_id, note, content_id, content_type})
 * /projects/columns/:column_id/cards
 */
const parseGitHubURL = require('../../../lib/parse-github-url')
const printOutput = require('../../../lib/print-output')
const authenticatedOctokit = require('../../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs =>
	yargs
		.option('column-url', {
			alias: ['c'],
			describe: 'A GitHub URL that contains the project column ID',
			demandOption: true,
		})
		.option('pull-request-url', {
			alias: ['p'],
			describe: 'A GitHub URL that contains the pull request ID.',
			demandOption: true,
		})
		/**
		 * Coerce IDs from GitHub URLs.
		 */
		.coerce(['column-url', 'pull-request-url'], arg => parseGitHubURL(arg))
		.example('column-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]#column-[number]')
		.example('pull-request-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]')

/**
 * Add a pull request to a GitHub project column.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.columnUrl - an object produced by parsing the GitHub URL.
 * @param {object} argv.pullRequestUrl - an object produced by parsing the GitHub URL.
 */
const handler = async ({ token, json, columnUrl, pullRequestUrl }) => {
	const inputs = {
		column_id: columnUrl.number,
		content_id: pullRequestUrl.number,
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
	command: 'add-pull-request [--column-url] [--pull-request-url]',
	desc: 'Add a pull request to a GitHub project column',
	builder,
	handler,
}
