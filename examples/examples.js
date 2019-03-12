const github = require("@financial-times/tooling-helpers").github({
	personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});

async function main() {
	try {
		// Create the project which returns an object with a project ID

		const project = await github.createProject({
			org: "financial-times-sandbox",
			name: "Sample Project"
		});

		const projectId = project.id;

		// Create 'To do', 'In progress' and 'Done' columns which return an object with a column IDs

		const toDoColumn = await github.createProjectColumn({
			project_id: projectId,
			name: "To do"
		});

		const toDoColumnId = toDoColumn.id;

		const inProgressColumn = await github.createProjectColumn({
			project_id: projectId,
			name: "In progress"
		});

		const inProgressColumnId = inProgressColumn.id;

		const doneColumn = await github.createProjectColumn({
			project_id: projectId,
			name: "Done"
		});

		const doneColumnId = doneColumn.id;

		// Create a PR which returns an object with a PR IDs

		const pullRequest = await github.createPullRequest({
			owner: "financial-times-sandbox",
			repo: "Western-Storm",
			title: "Sample pull request",
			head: "kb/sample-pull-request",
			base: "master",
			body: "Pull request body"
		});

		const pullRequestId = pullRequest.id;

		// Create a card with a PR which returns an object with a card ID

		const pullRequestCard = await github.createPullRequestCard({
			column_id: toDoColumnId,
			content_id: pullRequestId,
			content_type: "PullRequest"
		});
	} catch (err) {
		console.error(err);
	}
}

main();
