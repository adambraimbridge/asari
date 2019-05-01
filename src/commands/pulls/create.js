/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-create
 * const result = await octokit.pulls.create({owner, repo, title, head, base, *body, *maintainer_can_modify})
 * /repos/:owner/:repo/pulls
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
			describe: 'The URL of the GitHub branch to create a pull request from.',
		}),
		commonYargs.withBase(),
		commonYargs.withBody(),
		commonYargs.withTitle({ demandOption: true }),
	])

	return baseOptions(yargs).example('github-url', 'Pattern: https://github.com/[owner]/[repository]/tree/[branch]')
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.title
 * @param {string} argv.head - The name of the branch where your changes are implemented
 * @param {string} argv.base - The name of the branch you want the changes pulled into (Default: master)
 * @param {string} argv.bodyContent — This is created in the withBody() yarg option middleware.
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async ({ token, json, bodyContent, base, title, githubUrl }) => {
	const { owner, repo, value } = githubUrl
	const inputs = {
		body: bodyContent,
		owner,
		repo,
		title,
		head: value,
		base,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.create(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'create-pull-request <github-url> [--base] [--body] [--title]',
	desc: 'Create a new pull request',
	builder,
	handler,
}
