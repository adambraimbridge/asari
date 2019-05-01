/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-update
 * There is no 'closed' endpoint in the Octokit API. We use 'update' with a `state` of 'closed'.
 * const result = await octokit.projects.update({project_id, name, body, state, organization_permission, private, per_page, page})
 * /projects/:project_id
 *
 * There are three 'list' endpoints for projects in the Octokit API.
 * This command uses one of these list endpoints to get all projects for `account_type`.
 * Then, from that list, it can get the ID of the relevant project board.
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-list-for-user
 * const result = await octokit.projects.listForUser({username, state, per_page, page})
 * /users/:username/projects
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-list-for-org
 * const result = await octokit.projects.listForOrg({org, state, per_page, page})
 * /orgs/:org/projects
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-list-for-repo
 * const result = await octokit.projects.listForRepo({owner, repo, state, per_page, page})
 * /repos/:owner/:repo/projects
 */
const flow = require('lodash.flow')

const commonYargs = require('../../../lib/common-yargs')
const printOutput = require('../../../lib/print-output')
const authenticatedOctokit = require('../../../lib/octokit')

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		// prettier-ignore

		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub project to close.',
		}),
	])
	return baseOptions(yargs).example('github-url', 'Pattern: [https://][github.com]/[scope?]/[owner]/[repository?]/projects/[number]')
}

/**
 * Get a project based on its number from a list of projects.
 *
 * @param {integer} number
 * @param {object} projects
 */
const getProject = (number, projects) => {
	return projects.data.find(project => project.number === number)
}

/**
 * Update a project board to 'status: closed'.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {object} argv.githubUrl - The GitHub url parsed in the withGitHubUrl() yarg option into appropriate properties, such as `owner` and `repo`.
 */
const handler = async ({ token, json, githubUrl }) => {
	const { scope, owner, repo, number } = githubUrl
	const inputs = {
		state: 'all',
		per_page: 100,
	}
	try {
		/**
		 * Find the project based on account type and number.
		 */
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		let project
		if (scope === 'orgs') {
			inputs.org = owner
			const response = await octokit.projects.listForOrg(inputs)
			project = getProject(number, response)
		} else if (owner) {
			inputs.owner = owner
			inputs.repo = repo
			const response = await octokit.projects.listForRepo(inputs)
			project = getProject(number, response)
		} else {
			project = getProject(number, await octokit.projects.listForUser(inputs))
		}
		if (!project) {
			throw new Error(`No project found. Owner: ${owner}, repo: ${repo}, number: ${number}.`)
		}

		/**
		 * Update the project to a `state` of 'closed'
		 */
		const result = await octokit.projects.update({
			project_id: project.id,
			state: 'closed',
		})
		const { html_url, state } = result.data
		printOutput({ json, resource: { html_url, state } })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'close-project <github-url>',
	desc: 'Set the state of an existing project board to `closed`',
	builder,
	handler,
}
