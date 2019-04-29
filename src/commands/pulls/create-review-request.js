/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-createReviewRequest
 * const result = await octokit.pulls.createReviewRequest({owner, repo, number, *reviewers, *team_reviewers})
 * /repos/:owner/:repo/pulls/:number/requested_reviewers
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
		commonYargs.withNumber(),
		commonYargs.withReviewers(),
		commonYargs.withTeamReviewers(),
	])

	return baseOptions(yargs)
}

/**
 * Request a review for a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {integer} argv.number
 * @param {string} argv.number
 * @param {string} [argv.reviewers]
 * @param {string} [argv.team_reviewers]
 */
const handler = async ({ token, json, owner, repo, number, reviewers, team_reviewers }) => {
	const inputs = {
		owner,
		repo,
		pull_number: number,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.createReviewRequest(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'create-review-request [options]',
	desc: 'Request a review for a pull request',
	builder,
	handler,
}
