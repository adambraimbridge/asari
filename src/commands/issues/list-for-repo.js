/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-issues-list-for-repo
 * List all issues assigned to the authenticated user across all visible repositories.
 * const result = await octokit.issues.list([filter])
 */
const flow = require('lodash.flow')
const commonYargs = require('../../lib/common-yargs')
const printOutput = require('../../lib/print-output')
const authenticatedOctokit = require('../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub repository, the issues whence to glean.',
		}),
	])
	return baseOptions(yargs).example('github-url', 'Pattern: https://github.com/[owner]/[repository]')
}

/**
 * List all issues for a repository.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.type - Indicates which sorts of issues to return.
 */
const handler = async ({ token, json, githubUrl }) => {
	try {
		const { owner, repo } = githubUrl
		const octokit = await authenticatedOctokit({ personalAccessToken: token })

		// @see https://github.com/octokit/rest.js/blob/master/docs/src/pages/api/00_usage.md#pagination
		const request = octokit.issues.listForRepo.endpoint.merge({ owner, repo })
		const result = await octokit.paginate(request)
		result.forEach(issue => {
			const { title, created_at, html_url } = issue
			console.log('\x1b[36m%s\x1b[0m %s \x1b[2m%s\x1b[0m', created_at, title, html_url)
		})
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'list-for-repo <github-url>',
	desc: 'List all issues in a repository.',
	builder,
	handler,
}
