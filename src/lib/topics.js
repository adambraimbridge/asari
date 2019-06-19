const authenticatedOctokit = require('./octokit')
const uniq = require('lodash.uniq')
const isEqual = require('lodash.isequal')
const flatMap = require('lodash.flatmap')

const getTopics = async ({ githubUrl, token }) => {
	const { owner, repo } = githubUrl
	const octokit = await authenticatedOctokit({ personalAccessToken: token })

	const request = octokit.repos.listTopics({ owner, repo })
	const { data: { names: topics = [] } = {} } = await request

	return topics
}

/**
 * Expand any comma separated items in the array and trim the item strings
 * @param {Array} array
 */
const expandAndTrimArrayLists = array => flatMap(array, (item = '') => item.split(',').map(splitItem => splitItem.trim()))

const addTopics = async ({ githubUrl, token, topics: newTopics }) => {
	const initialTopics = await getTopics({ githubUrl, token })
	const { owner, repo } = githubUrl

	const octokit = await authenticatedOctokit({ personalAccessToken: token })
	const topicsToAddRaw = uniq(initialTopics.concat(newTopics))
	const topics = expandAndTrimArrayLists(topicsToAddRaw)

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
}
