module.exports = octokit => {
	return async ({ owner, repo, title, head, base, body }) => {
		/**
		 * Create a GitHub pull request.
		 *
		 * @see https://octokit.github.io/rest.js/#api-Pulls-create
		 */
		const result = await octokit.pulls.create({
			owner,
			repo,
			title,
			head,
			base,
			body
		});

		return result.data;
	};
};
