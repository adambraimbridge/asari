/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-issues-update
 * There is no "open" endpoint in the Octokit API. We use "update" with a `state` of "open".
 * const result = await octokit.issues.update({owner, repo, issue_number})
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
			describe: 'The URL of the GitHub issue to open.',
		}),
	])
	return baseOptions(yargs).example('github-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]')
}

/**
 * Update an issue.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async ({ token, json, githubUrl }) => {
	const { owner, repo, value } = githubUrl
	const inputs = {
		owner,
		repo,
		issue_number: value,
		state: 'open',
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.issues.update(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'open <github-url>',
	desc: 'Set the state of an existing issue to `open`',
	builder,
	handler,
}
