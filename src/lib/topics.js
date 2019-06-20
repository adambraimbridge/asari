const authenticatedOctokit = require('./octokit')
const uniq = require('lodash.uniq')
const isEqual = require('lodash.isequal')
const without = require('lodash.without')

const getTopics = async ({ githubUrl, token }) => {
	const { owner, repo } = githubUrl
	const octokit = await authenticatedOctokit({ personalAccessToken: token })

	const request = octokit.repos.listTopics({ owner, repo })
	const { data: { names: topics = [] } = {} } = await request

	return topics
}

const addTopics = async ({ githubUrl, token, topics: newTopics }) => {
	const initialTopics = await getTopics({ githubUrl, token })
	const { owner, repo } = githubUrl

	const octokit = await authenticatedOctokit({ personalAccessToken: token })
	const topics = uniq(initialTopics.concat(newTopics))

	if (isEqual(initialTopics, topics)) {
		return initialTopics
	}

	const request = octokit.repos.replaceTopics({ owner, repo, names: topics })
	const { data: { names: allTopics = [] } = {} } = await request

	return allTopics
}

const removeTopics = async ({ githubUrl, token, topics: topicsToRemove }) => {
	const initialTopics = await getTopics({ githubUrl, token })
	const { owner, repo } = githubUrl

	const octokit = await authenticatedOctokit({ personalAccessToken: token })
	const topics = without(initialTopics, ...topicsToRemove)

	if (isEqual(initialTopics, topics)) {
		return initialTopics
	}

	const request = octokit.repos.replaceTopics({ owner, repo, names: topics })
	const { data: { names: allTopics = [] } = {} } = await request

	return allTopics
}

module.exports = {
	getTopics,
	addTopics,
	removeTopics,
}
