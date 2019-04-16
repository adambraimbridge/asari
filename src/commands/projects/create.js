/**
 * There are three "create" endpoints for projects in the Octokit API. This command combines them into one.
 *
 * This command accepts a `--url` parameter.
 * It figures out from the URL whether it's for an organisation, repository or user.
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createForAuthenticatedUser
 * const result = await octokit.projects.createForAuthenticatedUser({name, [body], [per_page], [page]})
 * /user/projects
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createForOrg
 * const result = await octokit.projects.createForOrg({org, name, [body], [per_page], [page]})
 * /orgs/:org/projects
 *
 * @see: https://octokit.github.io/rest.js/#api-Projects-createForRepo
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
		commonYargs.withGitHubUrl({ demandOption: true }),
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
 * @param {string} argv.githubUrl
 * @param {string} argv.name
 * @param {string} argv.body
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, name, body, githubUrl }) => {
	// The file indicated by `body` has already been tested for readability in common-yargs, but double-check anyway.
	let bodyContent
	try {
		bodyContent = fs.readFileSync(body, 'utf8')
	} catch (error) {
		bodyContent = ''
	}
	const inputs = {
		name,
		body: bodyContent,
	}
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })

		// Detect the `owner` and `repo` from the GitHub `url`.
		// See: https://github.com/Financial-Times/ebi/blob/master/lib/github-helpers.js
		const parts = githubUrl.split('/')
		console.error(parts, bodyContent)

		let project
		// switch (account_type) {
		// 	case 'user':
		// 		project = await octokit.projects.createForAuthenticatedUser(inputs)
		// 		break
		// 	case 'repo':
		// 		inputs.repo = repo
		// 		project = await octokit.projects.createForRepo(inputs)
		// 		break
		// 	case 'org':
		// 		inputs.org = owner
		// 		project = await octokit.projects.createForOrg(inputs)
		// 		break
		// 	default:
		// 		throw new Error("Please provide a GitHub `account_type`. Either 'user', 'org' (Organisation) or 'repo' (Repository).")
		// }

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
