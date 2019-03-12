module.exports = octokit => {
	return async ({ column_id, content_id, content_type }) => {
		/**
		 * Create a GitHub project card.
		 *
		 * @see https://octokit.github.io/rest.js/#api-Projects-createCard
		 */
		const result = await octokit.projects.createCard({
			column_id,
			content_id,
			content_type
		});

		return result.data;
	};
};
