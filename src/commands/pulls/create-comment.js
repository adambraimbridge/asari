/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-createComment
 * const result = await octokit.pulls.createComment({ owner, repo, number, body, commit_id, path, position })
 * /repos/:owner/:repo/pulls/:number/comments
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
		commonYargs.withOwner,
		commonYargs.withRepo,
		commonYargs.withNumber,
		commonYargs.withBody,
	])

	return baseOptions(yargs)
		.option("commit_id", {
			describe: "The SHA of the commit needing a comment. Not using the latest commit SHA may render your comment outdated if a subsequent commit modifies the line you specify as the position.",
			type: "string",
		})
		.option("path", {
			describe: "The relative path to the file that necessitates a comment.",
			type: "string",
		})
		.option("position", {
			describe: "The position in the diff where you want to add a review comment. Note this value is not the same as the line number in the file.",
			type: "integer",
		})
}

/**
 * Create a comment for a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.commit_id
 * @param {string} argv.path 
 * @param {string} argv.position
 * @param {string} argv.body
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, number, body, commit_id, path, position }) => {

	// Ensure that all required properties have values
	const requiredProperties = {
		body,
		owner,
		repo,
		number,
		commit_id,
		path,
		position
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
	})
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.createComment(inputs)
		printOutput({ json, resource: result })
	}
	catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: "create-comment [options]",
	desc: "Create a comment on an existing pull request",
	builder,
	handler
}
