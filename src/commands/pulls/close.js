/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-update
 * There is no "closed" endpoint in the Octokit API. We use "update" with a `state` of "closed".
 * const result = await octokit.pulls.update({owner, repo, number, title, body, state, base, maintainer_can_modify})
 * /repos/:owner/:repo/pulls/:number
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
			describe: 'The URL of the GitHub pull request to close. Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]',
		}),
	])
	return baseOptions(yargs)
}

/**
 * Update a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.number
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, number }) => {
	const inputs = {
		owner,
		repo,
		number,
		state: 'closed',
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.update(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'close [options]',
	desc: 'Set the state of an existing pull request to `closed`',
	builder,
	handler,
}
