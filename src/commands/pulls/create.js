/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-create
 * const result = await octokit.pulls.create({owner, repo, title, head, base, *body, *maintainer_can_modify})
 * /repos/:owner/:repo/pulls
 */
const flow = require("lodash.flow")
const fs = require("fs")

const commonYargs = require("../../../lib/common-yargs")
const printOutput = require("../../../lib/print-output")
const authenticatedOctokit = require("../../../lib/octokit")

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withToken,
		commonYargs.withJson,
		commonYargs.withBase,
		commonYargs.withOwner,
		commonYargs.withRepo,
		commonYargs.withNumber,
		commonYargs.withReviewers,
		commonYargs.withTeamReviewers,
		commonYargs.withBody,
		commonYargs.withTitle,
	])

	return baseOptions(yargs)
		.option("branch", {
			describe: "Branch",
			demandOption: true,
			type: "string"
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
 * @param {string} argv.title
 * @param {string} argv.branch
 * @param {string} [argv.base]
 * @param {string} [argv.body]
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, base, body, owner, repo, title, branch }) => {

	// Ensure that all required properties have values
	const requiredProperties = {
		body,
		owner,
		repo,
		title,
		branch,
	}
	if (Object.values(requiredProperties).some(property => !property)) {
		throw new Error(`Please provide all required properties: ${Object.keys(requiredProperties).join(", ")}`)
	}

	// Confirm that the required file exists
	const correctFilePath = fs.existsSync(body)
	if (!correctFilePath) {
		throw new Error(`File path ${body} not found`)
	}

	const bodyContent = fs.readFileSync(body, "utf8")
	const inputs = Object.assign({}, requiredProperties, {
		body: bodyContent,
		head: branch,
		base,
	})
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.create(inputs)
		printOutput({ json, resource: result })
	}
	catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	command: "pulls create",
	desc: "Create a new pull request",
	builder,
	handler
}
