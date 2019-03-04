module.exports = (octokit) => {
    return async ({ project_id, name }) => {
        /**
         * Create a GitHub project column.
         *
         * @see https://octokit.github.io/rest.js/#api-Projects-createColumn
         */
        const result = await octokit.projects.createColumn({ project_id, name });

        return result.data;
    };
};

