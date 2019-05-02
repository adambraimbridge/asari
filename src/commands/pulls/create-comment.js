/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
 * const result = await octokit.issues.createComment({ owner, repo, issue_number, body })
 *
 * For any Pull Request, GitHub provides three kinds of comment views:
 * 	— comments on the Pull Request as a whole,
 *  — comments on a specific line within the Pull Request, and
 *  — comments on a specific commit within the Pull Request.
 * @see: https://developer.github.com/v3/guides/working-with-comments/
 *
 * This command adds a comment on the Pull Request as a whole.
 * "If you only want to create a comment on a pull request, use github.issues.createComment."
 * @see: https://github.com/octokit/rest.js/issues/712#issuecomment-359334646
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
			describe: 'The URL of the GitHub pull request to add a comment to.',
		}),
		commonYargs.withBody(),
	])
	return baseOptions(yargs).example('github-url', 'Pattern: [https://][github.com]/[owner]/[repository?]/pull/[number]')
}

/**
 * Create a comment for a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.bodyContent — This is created in the withBody() yarg option middleware.
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async ({ token, json, githubUrl, bodyContent }) => {
	const { owner, repo, number } = githubUrl
	const inputs = {
		owner,
		repo,
		issue_number: number,
		body: bodyContent,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.issues.createComment(inputs)
		printOutput({ json, resource: result })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'create-comment <github-url> [--body]',
	desc: 'Create a comment on an existing pull request',
	builder,
	handler,
}
