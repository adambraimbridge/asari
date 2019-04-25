/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-pulls-create
 * const result = await octokit.pulls.create({owner, repo, title, head, base, *body, *maintainer_can_modify})
 * /repos/:owner/:repo/pulls
 */
const flow = require('lodash.flow')
const fs = require('fs')

const commonYargs = require('../../../lib/common-yargs')
const parseGitHubURL = require('../../../lib/parse-github-url')
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
			describe: 'The URL of the GitHub branch to create a pull request from.',
		}),
		commonYargs.withBase(),
		commonYargs.withBody(),
		commonYargs.withTitle({ demandOption: true }),
	])

	return (
		baseOptions(yargs)
			/**
			 * Coerce values from the GitHub URL.
			 */
			.middleware(argv => {
				const githubData = parseGitHubURL(argv.githubUrl)
				argv.owner = githubData.owner
				argv.repo = githubData.repo
				argv.head = githubData.value
			})
	)
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.title
 * @param {string} argv.head
 * @param {string} argv.bodyContent — This is created in the withBody() yarg option middleware.
 * @param {string} [argv.base]
 */
const handler = async ({ token, json, base, bodyContent, owner, repo, title, head }) => {
	const inputs = {
		body: bodyContent,
		owner,
		repo,
		title,
		head,
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
	command: 'create <github-url> [options]',
	desc: 'Create a new pull request',
	builder,
	handler,
}
