const authenticatedOctokit = require('./octokit')

const getTopics = async ({ githubUrl, token }) => {
	const { owner, repo } = githubUrl
	const octokit = await authenticatedOctokit({ personalAccessToken: token })

	const request = octokit.repos.listTopics({ owner, repo })
	const { data: { names: topics = [] } = {} } = await request

	return topics
}

module.exports = {
	getTopics,
}
