/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-deleteComment
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
		// prettier-ignore
		commonYargs.withToken(),
		commonYargs.withJson(),
		commonYargs.withOwner(),
		commonYargs.withRepo(),
	])

	return baseOptions(yargs).option('comment_id', {
		describe: 'The ID of the comment to be deleted.',
		type: 'integer',
	})
}

/**
 * Create a comment from a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.comment_id
 */
const handler = async ({ token, json, owner, repo, comment_id }) => {
	const inputs = {
		owner,
		repo,
		comment_id,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.deleteComment(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'delete-comment [options]',
	desc: 'Delete a comment on an existing pull request',
	builder,
	handler,
}
