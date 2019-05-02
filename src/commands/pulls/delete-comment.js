/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-delete-comment
 * const result = await octokit.pulls.deleteComment({owner, repo, comment_id})
 * /repos/:owner/:repo/pulls/comments/:comment_id
 */
const flow = require('lodash.flow')
const commonYargs = require('../../../lib/common-yargs')
const printOutput = require('../../../lib/print-output')
const authenticatedOctokit = require('../../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub pull request comment to delete.',
		}),
	])

	return baseOptions(yargs).example('github-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]#issuecomment-[number]')
}

/**
 * Create a comment from a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */

const handler = async ({ token, json, githubUrl }) => {
	const { owner, repo, number } = githubUrl
	const inputs = {
		owner,
		repo,
		comment_id: number,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.issues.deleteComment(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'delete-comment <github-url>',
	desc: 'Delete a comment on an existing pull request',
	builder,
	handler,
}
