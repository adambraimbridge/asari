/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-deleteReviewRequest
 * const result = await octokit.pulls.deleteReviewRequest({owner, repo, number, reviewers, team_reviewers})
 * /repos/:owner/:repo/pulls/:number/requested_reviewers
 */
const flow = require("lodash.flow")
const commonYargs = require("../../../lib/common-yargs")
const printOutput = require("../../../lib/print-output")
const authenticatedOctokit = require("../../../lib/octokit")

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withToken,
		commonYargs.withJson,
		commonYargs.withOwner,
		commonYargs.withRepo,
		commonYargs.withNumber,
		commonYargs.withReviewers,
		commonYargs.withTeamReviewers,
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
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, number, reviewers, team_reviewers }) => {

	// Ensure that all required properties have values
	const requiredProperties = {
		owner,
		repo,
		number,
	}
	if (
		Object.values(requiredProperties).some(property => !property)
		|| (!reviewers && !team_reviewers)
	) {
		throw new Error(`Please provide all required properties: ${Object.keys(requiredProperties).join(", ")}, (and either reviewers or team_reviewers)`)
	}

	const inputs = Object.assign({}, requiredProperties, {
		reviewers,
		team_reviewers,
	})
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.deleteReviewRequest(inputs)
		printOutput({ json, resource: result })
	}
	catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	command: "deleteReviewRequest",
	desc: "Delete a requested review for a pull request",
	builder,
	handler
}
