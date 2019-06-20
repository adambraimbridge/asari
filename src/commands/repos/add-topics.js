/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-repos-replace-topics
 * Add topics to a repository.
 * const result = await octokit.repos.replaceTopics()
 */
const flow = require('lodash.flow')
const { withGitHubUrl, withTopics } = require('../../lib/common-yargs')
const printOutput = require('../../lib/print-output')
const { addTopics } = require('../../lib/topics')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		withGitHubUrl({
			describe: 'The URL of the GitHub repository to list the topics of.',
		}),
		withTopics({
			required: true,
		}),
	])
	return baseOptions(yargs).example('github-url', 'Pattern: https://github.com/[owner]/[repository]')
}

/**
 * Add topics to a repository.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 * @param {array} argv.topics - The topics to add
 */
const handler = async ({ token, json, githubUrl, topics: topicsToAdd }) => {
	try {
		const topics = await addTopics({ githubUrl, token, topics: topicsToAdd })
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
	command: 'add-topics <github-url>',
	desc: 'Add topics to a repository.',
	builder,
	handler,
}
