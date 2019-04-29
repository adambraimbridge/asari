/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-create-review-request
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
		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub pull request to assign a review request to.',
		}),
	])
	return baseOptions(yargs)
		.option('reviewers', {
			describe: 'The GitHub *user* account names to assign the review to.',
			type: 'string',
		})
		.option('team_reviewers', {
			describe: 'The GitHub *team* account names to assign the review to.',
			type: 'string',
		})
		.check(argv => {
			if (!argv.reviewers && !argv.team_reviewers) {
				throw new Error('Either --reviewers or --team_reviewers is required.')
			}
		})
		.example('github-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]')
}

/**
 * Request a review for a pull request.
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
	command: 'create-review-request <github-url> [options]',
	desc: 'Request a review for a pull request',
	builder,
	handler,
}
