/**
 * There are three "create" endpoints for projects in the Octokit API. This command combines them into one.
 *
 * This command accepts a `--url` parameter.
 * It figures out from the URL whether it's for an organisation, repository or user.
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-createForAuthenticatedUser
 * const result = await octokit.projects.createForAuthenticatedUser({name, [body], [per_page], [page]})
 * /user/projects
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-createForOrg
 * const result = await octokit.projects.createForOrg({org, name, [body], [per_page], [page]})
 * /orgs/:org/projects
 *
 * @see: https://octokit.github.io/rest.js/#octokit-routes-projects-createForRepo
 * const result = await octokit.projects.createForRepo({owner, repo, name, [body], [per_page], [page]})
 * /repos/:owner/:repo/projects
 */
const flow = require('lodash.flow')
const fs = require('fs')

const commonYargs = require('../../../lib/common-yargs')
const parseGitHubURL = require('../../../lib/parse-github-url')
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
		commonYargs.withGitHubUrl({
			describe: 'The URL of the GitHub organisation, user or repository for the new project board.',
		}),
		commonYargs.withBody(),
	])
	return (
		baseOptions(yargs)
			.option('name', {
				alias: 'n',
				describe: 'The name you wish to give the new project board',
				demandOption: true,
				type: 'string',
			})
			/**
			 * Coerce values from the GitHub URL.
			 */
			.middleware(argv => {
				const githubData = parseGitHubURL(argv.GitHubURL)
				argv.owner = githubData.owner
				argv.repo = githubData.repo
			})
	)
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.name
 * @param {string} argv.body
 * @param {string} argv.owner
 * @param {string} argv.repo
 */
const handler = async ({ token, json, name, body, owner, repo }) => {
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
		let project
		if (repo) {
			inputs.owner = owner
			inputs.repo = repo
			project = await octokit.projects.createForRepo(inputs)
		} else if (owner) {
			inputs.org = owner
			project = await octokit.projects.createForOrg(inputs)
		} else {
			project = await octokit.projects.createForAuthenticatedUser(inputs)
		}
		const { id } = project.data
		const todo = await octokit.projects.createColumn({ project_id: id, name: 'To do' })
		const doing = await octokit.projects.createColumn({ project_id: id, name: 'In progress' })
		const done = await octokit.projects.createColumn({ project_id: id, name: 'Done' })

		// Create a default kanban three-column setup in the new project.
		const projectWithColumns = {
			project: project.data,
			columns: {
				todo: todo.data,
				doing: doing.data,
				done: done.data,
			},
		}
		printOutput({ json, resource: projectWithColumns })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'create <GitHub URL> [options]',
	desc: 'Create a new project',
	builder,
	handler,
}
