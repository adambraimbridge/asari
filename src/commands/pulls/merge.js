/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-merge
 * const result = await octokit.pulls.merge({ owner, repo, number, *commit_title, *commit_message, *sha, *merge_method})
 * /repos/:owner/:repo/pulls/:number/merge
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
			describe: 'The URL of the GitHub pull request to merge.',
		}),
	])

	return baseOptions(yargs)
		.option('method', {
			describe: 'Merge method to use.',
			choices: ['merge', 'squash', 'rebase'],
			default: 'merge',
		})
		.example('github-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]')
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async ({ token, json, method, githubUrl }) => {
	const { owner, repo, number } = githubUrl
	const inputs = {
		merge_method: method,
		owner,
		repo,
		pull_number: number,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.merge(inputs)

		// TODO: Confirm that the github response has a "state" (of, e.g, "merged")
		const { html_url, state } = result.data
		printOutput({ json, resource: { html_url, state } })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'merge-pull-request <github-url> [--method]',
	desc: 'Merge an existing pull request',
	builder,
	handler,
}
