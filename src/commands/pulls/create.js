/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-create
 * const result = await octokit.pulls.create({owner, repo, title, head, base, *body, *maintainer_can_modify})
 * /repos/:owner/:repo/pulls
 */
const flow = require('lodash.flow')
const fs = require('fs')

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
		commonYargs.withBase(),
		commonYargs.withOwner(),
		commonYargs.withRepo(),
		commonYargs.withReviewers(),
		commonYargs.withTeamReviewers(),
		commonYargs.withBody(),
		commonYargs.withTitle(),
	])

	return baseOptions(yargs).option('head', {
		describe: 'The name of the branch where your changes are implemented.',
		demandOption: true,
		type: 'string',
	})
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
 * @param {string} argv.body
 * @param {string} [argv.base]
 */
const handler = async ({ token, json, base, body, owner, repo, title, head }) => {
	// Confirm that the required file exists
	const correctFilePath = fs.existsSync(body)
	if (!correctFilePath) {
		throw new Error(`File path ${body} not found`)
	}
	const bodyContent = fs.readFileSync(body, 'utf8')
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
	command: 'create [options]',
	desc: 'Create a new pull request',
	builder,
	handler,
}
