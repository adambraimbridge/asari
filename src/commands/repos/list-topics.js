/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-repos-list-topics
 * List all topics of a repository.
 * const result = await octokit.repos.listTopics()
 */
const flow = require('lodash.flow')
const commonYargs = require('../../lib/common-yargs')
const printOutput = require('../../lib/print-output')
const { getTopics } = require('../../lib/topics')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub repository to list the topics of.',
		}),
	])
	return baseOptions(yargs).example('github-url', 'Pattern: https://github.com/[owner]/[repository]')
}

/**
 * List all issues for a repository.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async args => {
	const { token, json, githubUrl } = args
	try {
		const topics = await getTopics({ githubUrl, token })
		if (json) {
			printOutput({ json, resource: topics })
		} else {
			const output = topics.join('\n')
			console.log(output)
		}
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'list-topics <github-url>',
	desc: 'List all topics of a repository.',
	builder,
	handler,
}
