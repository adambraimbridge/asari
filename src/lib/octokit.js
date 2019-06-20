const Octokit = require('@octokit/rest').plugin(require('@octokit/plugin-throttling'))

module.exports = async ({ personalAccessToken }) => {
	if (!personalAccessToken) {
		throw new Error('Missing personalAccessToken option - https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/')
	}

	/**
	 * Return an authenticated instance of Octokit
	 */
	try {
		const printRateLimitwarning = (retryAfter, options) => {
			octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}. You can retry in ${retryAfter} seconds.`)
		}
		const octokit = await new Octokit({
			previews: [
				/**
				 * Access Projects API while it is under preview
				 *
				 * @see https://developer.github.com/v3/projects
				 */
				'inertia-preview',
				/**
				 * Access Topics API while it is under preview
				 *
				 * @see https://developer.github.com/v3/repos/#list-all-topics-for-a-repository
				 */
				`mercy-preview`,
			],
			/**
			 * Authenticate GitHub API calls using GitHub personal access token
			 *
			 * @see https://github.com/octokit/rest.js#authentication
			 */
			auth: `token ${personalAccessToken}`,

			/**
			 * Automatically throttle requests as per GitHub’s best practices
			 * @see https://octokit.github.io/rest.js/#throttling
			 */
			throttle: {
				onRateLimit: printRateLimitwarning,
				onAbuseLimit: printRateLimitwarning,
			},
		})

		return octokit
	} catch (error) {
		throw new Error(error)
	}
}
