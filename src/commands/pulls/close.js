/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-update 
 * There is no "closed" endpoint in the Octokit API. We use "update" with a `state` of "closed".
 * const result = await octokit.pulls.update({owner, repo, number, title, body, state, base, maintainer_can_modify})
 * /repos/:owner/:repo/pulls/:number
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
		commonYargs.withBody,
		commonYargs.withTitle,
	])
	return baseOptions(yargs)
		.option("maintainer_can_modify", {
			describe: "Indicates whether maintainers can modify the pull request.",
			type: "string",
		})
}

/**
 * Update a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.number
 * @param {string} [argv.title]
 * @param {string} [argv.body]
 * @param {string} [argv.base]
 * @param {string} [argv.maintainer_can_modify]
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, number, title, body, base, maintainer_can_modify }) => {

	// Ensure that all required properties have values
	const requiredProperties = {
		owner,
		repo,
		number,
	}
	if (Object.values(requiredProperties).some(property => !property)) {
		throw new Error(`Please provide all required properties: ${Object.keys(requiredProperties).join(", ")}`)
	}

	// Confirm that the required file exists
	let bodyContent;
	if (body) {
		const correctFilePath = fs.existsSync(body)
		if (!correctFilePath) {
			throw new Error(`File path ${body} not found`)
		}
		bodyContent = fs.readFileSync(body, "utf8")
	}
	const inputs = Object.assign({}, requiredProperties, {
		title,
		body: bodyContent,
		base,
		maintainer_can_modify,
		state: "closed",
	})
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.update(inputs)
		printOutput({ json, resource: result })
	}
	catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: "close",
	desc: "Set the state of an existing pull request to `closed`",
	builder,
	handler
}
