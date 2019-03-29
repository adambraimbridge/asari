module.exports = octokit => {
	return async ({ org }) => {
		/**
		 * List all organisation projects.
		 *
		 * @see https://developer.github.com/v3/projects/#list-organization-projects
		 */
		const result = await octokit.projects.listForOrg({
            org, 
            state: 'open', 
            per_page: 100
        });

		return result.data;
	};
};