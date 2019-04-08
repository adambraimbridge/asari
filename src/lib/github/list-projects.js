module.exports = octokit => {
	return async ({ org }) => {
		/**
		 * List all organisation projects.
		 *
		 * @see https://developer.github.com/v3/projects/#list-organization-projects
		 */
		const result = await octokit.projects.listForOrg({
			org,
			state: 'open'
		});

		const paginatedResult = await octokit.paginate(result);

		return paginatedResult;
	};
};
