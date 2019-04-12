/**
 * @see: https://octokit.github.io/rest.js/#api-Projects-update
 * There is no 'closed' endpoint in the Octokit API. We use 'update' with a `state` of 'closed'.
 * const result = await octokit.projects.update({project_id, name, body, state, organization_permission, private, per_page, page})
 * /projects/:project_id
 *
 * There are three 'list' endpoints for projects in the Octokit API.
 * This command uses one of these list endpoints to get all projects for `account_type`.
 * Then it can get the ID of the relevant project board, from that list.
 *
 * If the `account_type` is 'user', it lists a user's project boards.
 * If the `account_type` is 'org', it lists a organization's project boards.
 * If the `account_type` is 'repo', it lists a repository's project boards. This type requres a `repo` argument.
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-listForUser
 * const result = await octokit.projects.listForUser({username, state, per_page, page})
 * /users/:username/projects
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-listForOrg
 * const result = await octokit.projects.listForOrg({org, state, per_page, page})
 * /orgs/:org/projects
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-listForRepo
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
		commonYargs.withToken(),
		commonYargs.withJson(),
		commonYargs.withOwner({ demandOption: true }), // This is either an organisation or a user
		commonYargs.withRepo(),
		commonYargs.withNumber({ demandOption: true }),
		commonYargs.withAccountType({ demandOption: true }),
	])
	return baseOptions(yargs)
}

/**
 * Get a project based on its number from a list of projects.
 *
 * @param {*} number
 * @param {*} projects
 */
const getProject = (number, projects) =>
	projects.data.find(project => {
		return project.number === number
	})

/**
 * Update a project board to 'status: closed'.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.number
 * @param {string} argv.account_type
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, number, account_type }) => {
	const inputs = {
		owner,
		number,
		account_type,
		state: 'all',
		per_page: 100,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })

		/**
		 * Find the project based on account type and number.
		 */
		let project
		switch (account_type) {
			case 'user':
				inputs.username = owner
				project = getProject(number, await octokit.projects.listForUser(inputs))
				break
			case 'repo':
				inputs.repo = repo
				project = getProject(number, await octokit.projects.listForRepo(inputs))
				break
			case 'org':
				inputs.org = owner
				project = getProject(number, await octokit.projects.listForOrg(inputs))
				break
			default:
				throw new Error('Please provide a GitHub `account_type`. Either "user", "org" (Organisation) or "repo" (Repository).')
		}
		if (!project) {
			throw new Error(`No project found for number: ${number}.`)
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
	command: 'close [options]',
	desc: 'Set the state of an existing project board to `closed`',
	builder,
	handler,
}
