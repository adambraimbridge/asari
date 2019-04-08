module.exports = octokit => {
	return async ({ project_id }) => {
		/**
		 * Update the state of a GitHub project from `open` to `closed`.
		 *
		 * @see https://octokit.github.io/rest.js/#api-Projects-update
		 */
		const result = await octokit.projects.update({
			project_id,
			state: 'closed'
		});

		return result.data;
	};
};