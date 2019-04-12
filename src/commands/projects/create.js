/**
 * There are three "create" endpoints for projects in the Octokit API. This command combines them into one.
 *
 * This command accepts a `--url` parameter.
 * It figures out from the URL whether it's for an organisation, repository or user.
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createForAuthenticatedUser
 * Creates an user project board. Returns a 404 Not Found status if projects are disabled for the user.
 * const result = await octokit.projects.createForAuthenticatedUser({name, [body], [per_page], [page]})
 * /user/projects
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createForOrg
 * Creates an organization project board. Returns a 404 Not Found status if projects are disabled in the organization.
 * const result = await octokit.projects.createForOrg({org, name, [body], [per_page], [page]})
 * /orgs/:org/projects
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createForRepo
 * Creates a repository project board. Returns a 404 Not Found status if projects are disabled in the repository.
 * const result = await octokit.projects.createForRepo({owner, repo, name, [body], [per_page], [page]})
 * /repos/:owner/:repo/projects
 */
const flow = require('lodash.flow')
const fs = require('fs')

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
		commonYargs.withGitHubUrl(),
		commonYargs.withOwner({ demandOption: true }), // This is either an organisation or a user
		commonYargs.withRepo(),
		commonYargs.withBody(),
	])
	return baseOptions(yargs).option('name', {
		describe: 'Project name',
		demandOption: true,
		type: 'string',
	})
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.name
 * @param {string} argv.body
 * @param {string} argv.account_type
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, name, body, account_type }) => {
	// Confirm that the required file exists
	const correctFilePath = fs.existsSync(body)
	if (!correctFilePath) {
		throw new Error(`File path ${body} not found`)
	}
	const bodyContent = fs.readFileSync(body, 'utf8')
	const inputs = {
		owner,
		name,
		body: bodyContent,
		account_type,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })

		let project
		switch (account_type) {
			case 'user':
				project = await octokit.projects.createForAuthenticatedUser(inputs)
				break
			case 'repo':
				inputs.repo = repo
				project = await octokit.projects.createForRepo(inputs)
				break
			case 'org':
				inputs.org = owner
				project = await octokit.projects.createForOrg(inputs)
				break
			default:
				throw new Error("Please provide a GitHub `account_type`. Either 'user', 'org' (Organisation) or 'repo' (Repository).")
		}

		const { project_id } = project.data

		// Create a default kanban three-column setup in the new project.
		const projectWithColumns = {
			project: project,
			columns: {
				todo: await octokit.projects.createColumn({ project_id, name: 'To do' }),
				doing: await octokit.projects.createColumn({ project_id, name: 'In progress' }),
				done: await octokit.projects.createColumn({ project_id, name: 'Done' }),
			},
		}
		printOutput({ json, resource: projectWithColumns })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'create [options]',
	desc: 'Create a new project',
	builder,
	handler,
}
