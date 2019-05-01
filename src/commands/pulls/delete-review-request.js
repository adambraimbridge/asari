/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-delete-review-request
 * const result = await octokit.pulls.deleteReviewRequest({owner, repo, number, *reviewers, *team_reviewers})
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
		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub pull request to delete a review request from.',
		}),
		commonYargs.withReviewers(),
		commonYargs.withTeamReviewers(),
	])
	return baseOptions(yargs)
		.check(argv => {
			if (!argv.reviewers && !argv.teamReviewers) {
				throw new Error('Missing required argument: Either reviewers or team-reviewers.')
			}
			return true
		})
		.example('github-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]')
}

/**
 * Request a review for a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.reviewers
 * @param {string} argv.teamReviewers
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async ({ token, json, reviewers, team_reviewers, githubUrl }) => {
	const { owner, repo, number } = githubUrl
	const inputs = {
		owner,
		repo,
		pull_number: number,
		reviewers,
		team_reviewers,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.deleteReviewRequest(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'delete-review-request <github-url> [reviewers|team-reviewers]',
	desc: 'Delete a review for a pull request',
	builder,
	handler,
}
